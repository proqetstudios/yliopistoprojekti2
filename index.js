require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }

app.use(errorHandler)

const Contact = require('./models/contact')

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

const getNumberOfContacts = () => {
    return persons.length
}

const getTime = () => {
    return new Date()
}

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${getNumberOfContacts()} people</p><p>${getTime()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
      response.json(contacts)
    })
  })

app.get('/api/persons/:id', (request, response) =>  {
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
      })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

const sendError = (response, code, text) => {
    response.status(code).json({
        error: text
    })
}

const generateId = () => {
    return Math.floor(Math.random() * 9999999)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name) {
        sendError(response, 300, 'contact person name not defined')
    } else if (!body.number) {
        sendError(response, 300, 'contact person number not defined')
    } else if (persons.filter(x => x.name === body.name).length > 0) {
        sendError(response, 300, 'contact person name already exists')
    } else {
        const contact = new Contact({
            name: body.name,
            number: body.number
        })
    
        contact.save().then(savedContact => {
            response.json(savedContact)
        })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})