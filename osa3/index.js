require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app =  express()
const Person = require('./models/puh')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
morgan.token('content', (req) => {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(p => {
    res.json(p)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person.countDocuments({}, (error, count) => {
    res.send(`
            <p> Phonebook has info for ${count} people</p>
            <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(p => {
      if(p) {
        res.json(p)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


/* const generateId = () => {
    const randomId = persons.length > 0
        ? Math.floor(Math.random() * 1000)
        : 0
    return randomId
} */

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    //id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch( error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})