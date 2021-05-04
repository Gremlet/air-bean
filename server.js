const express = require('express')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const db = lowdb(adapter)
const { nanoid } = require('nanoid')
const dayjs = require('dayjs')
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
    let result = {}

    for (let i = 0; i < userOrder.id.length; i++) {
        let coffee = db.get('menu').find({ id: userOrder.id[i] }).value()

        title.push(coffee.title)
        price = price + coffee.price
    }

    let order = {
        id: userOrder.id,
        title: title,
        price: price,
        ETA: dayjs()
            .add(Math.floor(Math.random() * (15 - 5 + 1)) + 5, 'm')
            .format('MMM D, YYYY h:mm A'),
        orderNumber: nanoid(5),
        userId: userOrder.userId,
    }

    // validate userId
    let validatedId = db.get('users').find({ id: userOrder.userId }).value()
    if (validatedId) {
        db.get('orders').push(order).write()
        result.success = true
        result.ETA = order.ETA
        result.orderNumber = order.orderNumber
    } else {
        console.log('User not found')
        result.success = false
    }

    res.json(result)
})

app.post('/api/account', (req, res) => {
    // add validation
    let userAccount = req.body
    let usernameExists = db.get('users').find({ username: userAccount.username }).value()
    let result = {
        usernameExists: false,
    }
    console.log(usernameExists)

    if (usernameExists) {
        result.usernameExists = true
    }
    if (!usernameExists) {
        result.usernameExists = false
        db.get('users')
            .push({ id: nanoid(4), username: userAccount.username, password: userAccount.password })
            .write()
    }

    res.json(result)
})

app.get('/api/order/:id', (req, res) => {
    let ID = req.params.id
    let order = db.get('orders').filter({ userId: ID }).value()
    let completeOrder = []

    if (order.length === 0) {
        console.log('No user with that ID found')
    }

    order.forEach((element) => {
        if (dayjs(element.ETA) < dayjs()) {
            element.status = 'Delivered'
        }
        if (dayjs(element.ETA) > dayjs()) {
            element.status = 'Drone on the way'
        }
        completeOrder.push(element)
        console.log(dayjs(element.ETA) < dayjs())
    })

    res.json(completeOrder)
})

function initiateDatabase() {
    db.defaults({ menu: [] }).write()
    db.defaults({ orders: [] }).write()
    db.defaults({ users: [] }).write()
}

app.listen(port, () => {
    console.log('Server started')
    initiateDatabase()
})
