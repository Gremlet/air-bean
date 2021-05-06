const { nanoid } = require('nanoid')
const dayjs = require('dayjs')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const db = lowdb(adapter)

function initiateDatabase() {
    db.defaults({ menu: [] }).write()
    db.defaults({ orders: [] }).write()
    db.defaults({ users: [] }).write()
}

function getMenu() {
    return db.get('menu').value()
}

function postOrder(userOrder) {
    let price = 0
    let title = []
    let result = {}
    let menu = db.get('menu').value()

    for (let i = 0; i < userOrder.id.length; i++) {
        if (userOrder.id[i] > menu.length) {
            result.success = false
            result.message = `Coffee with id:${userOrder.id[i]} not found`
            return result
        }
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
        result.message = 'User not found'
    }

    return result
}

function createAccount(userAccount) {
    let usernameExists = db.get('users').find({ username: userAccount.username }).value()
    let result = {
        usernameExists: false,
        success: false,
    }
    console.log(usernameExists)

    if (usernameExists) {
        result.usernameExists = true
        result.message = 'Username already exists'
    }
    if (!usernameExists) {
        result.usernameExists = false
        result.success = true
        db.get('users')
            .push({ id: nanoid(4), username: userAccount.username, password: userAccount.password })
            .write()
    }
    return result
}

function getOrderHistory(ID) {
    let order = db.get('orders').filter({ userId: ID }).value()
    let completeOrder = []
    let status = ''

    if (order.length === 0) {
        console.log('No order with that user ID found')
    }

    order.forEach((element) => {
        if (dayjs(element.ETA) < dayjs()) {
            status = 'Delivered'
        }
        if (dayjs(element.ETA) > dayjs()) {
            let diff = dayjs(element.ETA).diff(dayjs(), 'm') + 1
            if (diff === 1) {
                status = `Coffee drone landing in ${diff} minute`
            } else {
                status = `Coffee drone landing in ${diff} minutes`
            }
        }
        completeOrder.push({
            id: element.id,
            title: element.title,
            price: element.price,
            ETA: element.ETA,
            orderNumber: element.orderNumber,
            userId: element.userId,
            status: status,
        })
        console.log(dayjs(element.ETA) < dayjs())
    })
    return completeOrder
}

exports.initiateDatabase = initiateDatabase
exports.getMenu = getMenu
exports.postOrder = postOrder
exports.createAccount = createAccount
exports.getOrderHistory = getOrderHistory
