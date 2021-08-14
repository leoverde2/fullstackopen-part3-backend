const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons =
  [
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const info = (
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
  response.send(info)
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
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

const errorHandler = (body) => {
  if (!body.name) {
    return 'name is missing'
  }
  else if (!body.number) {
    return 'number is missing'
  }
  else if (persons.find(person => person.name === body.name)) {
    return 'name must be unique'
  }
  else if (persons.find(person => person.number === body.number)) {
    return 'number must be unique'
  }
  else return false
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const error = errorHandler(body)
  if (error !== false) {
    return response.status(400).json({
      error: error
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)