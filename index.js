require('dotenv').config()
const express = require('express')
const logger = require('./logger')
const cors = require('cors')
const PhonebookEntry = require('./models/phonebookEntry')
const { default: mongoose } = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.redirect('/info')
})
app.get('/info', (request, response) => {
  PhonebookEntry.estimatedDocumentCount().then(count => {
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({}).then(phonebookEntries => {
    response.json(phonebookEntries)
  })
})
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (name && number) {
    PhonebookEntry.find({ name }).then(result => {
      console.log(`result is ${JSON.stringify(result)} length is: ${result.length}`)
      const nameUnique = result?.length === 0
      if (nameUnique) {
        const ne = new PhonebookEntry({ name, number })
        ne.save().then(savedPhonebookEntry => {
          return response.json(savedPhonebookEntry)
        })
      } else {
        return response.status(400).json({ error: "Name must be unique" })
      }
    })
  }
  else {
    return response.status(400).json({ error: "Person's name or number missing" })
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
