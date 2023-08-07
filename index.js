const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny', 'requestBody'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const info = `<p>Phonebook has info for ${persons.length} people<br/>${new Date()}</p>`
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const content = request.body
    console.log(content);
    if (!content.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }
    if (!content.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    if (persons.some(person => person.name === content.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }

    content.id = Math.random(1000)
    persons = persons.concat(content)
    response.json(content)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})