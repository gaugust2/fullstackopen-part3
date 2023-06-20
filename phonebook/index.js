const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token("content", (req) => { 
    return req.method === "POST" ? JSON.stringify(req.body) : "" 
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

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
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let content = `Phonebook has info for ${persons.length} people
    <br>${new Date()}`
    response.send(content)
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

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const nameExists = persons.find(person => person.name === name)

    if(nameExists){
        return response.status(400).json({
            error: 'name already exists in database'
        })
    }

    const id = Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)
    const person = { id, name, number }
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})