const express = require('express')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const db = lowdb(adapter)
const { nanoid } = require('nanoid')
const moment = require('moment')
const port = 8080

const app = express()

app.use(express.json())

app.get('/api/coffee', (req, res) => {
    let menu = db.get('menu').value()
    res.json(menu)
})

app.post('/api/order', (req, res) => {
    let userOrder = req.body
    let price = 0
    let title = []
    for (let i = 0; i < userOrder.id.length; i++) {
        let coffee = db.get('menu').find({ id: userOrder.id[i] }).value()

        title.push(coffee.title)
        price = price + coffee.price
    }
    console.log(price)
    console.log(title)
    console.log(moment().add(15, 'm').format('LT'))

    console.log(userOrder)
    let order = db
        .get('orders')
        .push({
            id: userOrder.id,
            title: title,
            price: price,
            ETA: moment().add(15, 'm').format('LT'),
            orderNumber: nanoid(5),
            userId: userOrder.userId,
        })
        .write()
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
    let order = []
    let orderList = db.get('orders').value()
    for (let i = 0; i < orderList.length; i++) {
        order = db.get('orders').filter({ userId: ID }).value()
    }

    console.log(order)

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
