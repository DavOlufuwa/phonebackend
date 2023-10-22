require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Contacts = require('./models/contacts')


const url = process.env.MONGO_DB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const app = express()

app.use(express.json())
app.use(cors())


morgan.token('body', res => JSON.stringify(res.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

app.get('/api/persons', (req, res, next) => {
  Contacts.find({}).then(result => {
    res.json(result)
  }).catch(error => next(error))
})

app.get('/info', (req, res) => {
  Contacts.find({})
  .then(result => {
    res.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>`)
  }) 
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Contacts.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(error => {
    console.log(error)
    res.status(500).send({ error: 'malformatted id' })
  })
})
 
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Contacts.findByIdAndDelete(id)
  .then(() => res.status(204).end())
  .catch(error => next(error))
}) 


app.post('/api/persons', (req, res, next) => {
  const body = req.body
  
  if(!body.name || !body.number){
    return res.status(400).json({ error: 'content missing'})
  }

  const person = new Contacts({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id

  const person = {
    name: body.name,
    number: body.number
  }

  Contacts.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "unknown endpoint"
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}


app.use(unknownEndpoint);
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

