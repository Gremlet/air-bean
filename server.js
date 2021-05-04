const express = require('express')
const { initiateDatabase } = require('./dbHandlers')
const port = 8080
const coffeeRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use('/api', coffeeRouter)

app.listen(port, () => {
    console.log('Server started')
    initiateDatabase
})
