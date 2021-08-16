require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const Person = require('./models/person')
const mongoose = require('mongoose')

morgan.token('body', (req, res) => JSON.stringify(req.body))
const createLogger = (':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.static('build'))
app.use(morgan(createLogger))
app.use(express.json())

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.collection
    .count()
    .then(length => {
      const info = (
        `<p>Phonebook has info for ${length} people</p>
        <p>${new Date()}</p>`
      )
      response.send(info)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const { number } = body

  Person.findByIdAndUpdate(request.params.id, { number }, {new: true, runValidators: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)