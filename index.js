const express = require('express')
const app = express()
app.use(express.json())

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
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.post('/api/persons', (request, response) => {
  const person = request.body;
  console.log(request.body)
  if(person?.name && person?.number){
    const isNameUnique = persons.every(currentPerson => currentPerson.name !== person.name)
    if( !isNameUnique ){
      return response.status(400).json({error: "Name must be unique"})
    } 
    person.id = Math.floor( Math.random() * 1000000)
    persons.push(person);
    response.json(person)
  }
  else {
    response.status(400).json({error: "person's name or number missing"})
  }

})
app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id == request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const updatedPersons = persons.filter(person => person.id.toString() !== request.params.id.toString())
  const found = updatedPersons.length < persons.length
  if (found) {
    persons = updatedPersons
    response.json(persons)
  } else {
    response.status(204).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
