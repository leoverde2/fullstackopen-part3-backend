require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))
const createLogger = (':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.json())
app.use(morgan(createLogger))
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
  Person.collection
    .count()
    .then(length => {
      const info = (
        `<p>Phonebook has info for ${length} people</p>
        <p>${new Date()}</p>`
      )
      response.send(info)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT)