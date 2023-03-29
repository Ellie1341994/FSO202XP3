require('dotenv').config()
const express = require('express')
const logger = require('./logger')
const cors = require('cors')
const PhonebookEntry = require('./models/phonebookEntry')
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.redirect('/info')
})
app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(`<p>Phonebook has info for ${phonebookEntries.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({}).then(phonebookEntries => {
    response.json(phonebookEntries)
  })
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
