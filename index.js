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
    PhonebookEntry.findOne({ name }).then(foundPhonebookEntry => {
      const nameUnique = !Boolean(foundPhonebookEntry)
      const newPhonebookEntry = new PhonebookEntry({ name, number })
      if (nameUnique) {
        newPhonebookEntry.save().then(savedPhonebookEntry => {
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
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  const updatedPhonebookEntry = { name, number }
  PhonebookEntry.findByIdAndUpdate(request.params.id, updatedPhonebookEntry, { new: true })
    .then(updatedPhonebookEntry =>
      response.json(updatedPhonebookEntry)
    ).catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  PhonebookEntry.findById(request.params.id).then(entry => {
    entry ?
      response.json(entry) :
      response.status(404).send(`Resource ${id} not found`);
  }).catch(error => next(error))

})
app.delete('/api/persons/:id', (request, response, next) => {
  PhonebookEntry.findByIdAndDelete(request.params.id).then(deletedEntry => {
    deletedEntry ?
      response.json(deletedEntry) :
      response.status(404).send(`Resource ${id} not found`);
  }
  ).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// errorHandler has to be the last loaded middleware.
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

