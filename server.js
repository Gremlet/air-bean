const express = require('express')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const db = lowdb(adapter)
const { nanoid } = require('nanoid')
const port = 8080

const app = express()

app.use(express.json())

app.get('/api/coffee', (req, res) => {
    let menu = db.get('menu').value()
    res.json(menu)
})

app.post('/api/order', (req, res) => {
    let userOrder = req.body

    console.log(userOrder)
    let order = db.get('orders').push(userOrder).write()
    res.json(order)
})

app.post('/api/account', (req, res) => {
    let userAccount = req.body
    let account = db
        .get('users')
        .push({ id: nanoid(4), username: userAccount.username, password: userAccount.password })
        .write()

    res.json(account)
})

app.get('/api/order/:id', (req, res) => {
    ID = req.params.id
    const testOrder = {}
    let order = db.get('orders').find({ userId: ID }).value()
    console.log(order)
    // let menuID = db.get('menu').find({ id: order.id }).value()
    // console.log(menuID)
    // let price = order.id.reduce((a, b) => a + b)
    // console.log(price)
    res.json(order)
})

function initiateDatabase() {
    db.defaults({ menu: [] }).write()
    db.defaults({ orders: [] }).write()
    db.defaults({ users: [] }).write()
}

app.listen(8080, () => {
    console.log('Server started')
    initiateDatabase()
})
