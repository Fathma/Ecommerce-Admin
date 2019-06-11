const express = require('express')
const router = express.Router()

const customer = require('../controllers/customer.controller')

router.get('/RegisteredCustomer', customer.viewListOfCustomers)

module.exports = router
