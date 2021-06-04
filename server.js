const express = require('express')
var cors = require('cors')
const { initiateDatabase } = require('./dbHandlers')
const port = 8080
const coffeeRouter = require('./routes/index')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', coffeeRouter)

app.listen(port, () => {
    console.log('Server started at port: ' + port)
    initiateDatabase
})
