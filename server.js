const express = require('express')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const db = lowdb(adapter)
const port = 8080
const coffeeRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use('/api', coffeeRouter)

function initiateDatabase() {
    db.defaults({ menu: [] }).write()
    db.defaults({ orders: [] }).write()
    db.defaults({ users: [] }).write()
}

app.listen(port, () => {
    console.log('Server started')
    initiateDatabase()
})
