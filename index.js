require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny', 'requestBody'))


app.get('/info', async (request, response) => {
  const personData = await Person.find({})
  const info = `<p>Phonebook has info for ${personData.length} people<br/>${new Date()}</p>`
  response.send(info)
})

app.get('/api/persons', async (request, response) => {
  const personData = await Person.find({})
  response.json(personData)
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } 
  catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } 
  catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const body = request.body
  console.log(body)

  const person = {
    name: body.name,
    number: body.number
  }
  try {
    const personData = await Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'  })
    response.json(personData)
  }
  catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  console.log(body)

  const person = new Person({
    name: body.name,
    number: body.number
  })
  try{
    const personData = await person.save()
    response.json(personData)
  }
  catch (error) {
    next(error)
  }
   
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})