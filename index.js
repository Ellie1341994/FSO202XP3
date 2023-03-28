const express = require('express')
const logger = require('./logger')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(logger)
let phonebookEntries = [
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
  },
]

app.get('/', (request, response) => {
  response.redirect('/info')
})
app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(`<p>Phonebook has info for ${phonebookEntries.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebookEntries)
})
app.post('/api/persons', (request, response) => {
  const person = request.body;
  console.log(request.body)
  if(person?.name && person?.number){
    const isNameUnique = phonebookEntries.every(currentPerson => currentPerson.name !== person.name)
    if( !isNameUnique ){
      return response.status(400).json({error: "Name must be unique"})
    } 
    person.id = Math.floor( Math.random() * 1000000)
    phonebookEntries.push(person);
    response.json(person)
  }
  else {
    response.status(400).json({error: "person's name or number missing"})
  }

})
app.get('/api/persons/:id', (request, response) => {
  const person = phonebookEntries.find(person => person.id == request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const updatedPersons = phonebookEntries.filter(person => person.id.toString() !== request.params.id.toString())
  const found = updatedPersons.length < phonebookEntries.length
  if (found) {
    phonebookEntries = updatedPersons
    response.json(phonebookEntries)
  } else {
    response.status(204).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
