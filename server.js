const express = require('express')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('menu.json')
const db = lowdb(adapter)
const port = 8080

const app = express()

app.use(express.json())

app.get('/api/coffee', (req, res) => {
    let menu = db.get('menu').value()
    res.json(menu)
})

app.post('/api/order', (req, res) => {
    userOrder = req.body
    console.log(userOrder)
    let order = db.get('orders').push(userOrder).write()
    res.json(order)
})

function initiateDatabase() {
    db.defaults({ menu: [] }).write()
    db.defaults({ orders: [] }).write()
}

app.listen(8080, () => {
    console.log('Server started')
    initiateDatabase()
})
