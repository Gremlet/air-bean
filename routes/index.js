const { Router } = require('express')
const { postOrder, getMenu, createAccount, getOrderHistory } = require('./dbHandlers')

const router = new Router()

router.get('/coffee', (req, res) => {
    res.json(getMenu())
})

router.post('/order', (req, res) => {
    let userOrder = req.body
    res.json(postOrder(userOrder))
})

router.post('/account', (req, res) => {
    let userAccount = req.body
    res.json(createAccount(userAccount))
})

router.get('/order/:id', (req, res) => {
    let ID = req.params.id
    res.json(getOrderHistory(ID))
})

module.exports = router
