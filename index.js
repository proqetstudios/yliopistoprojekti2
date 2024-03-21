const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) =>  {
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
    persons = persons.filter(person => {
        console.log(person.id + " " + id)
        return person.id != id
    })

    response.status(204).end()
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
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }
    
        persons = persons.concat(person)
    
        response.json(person)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})