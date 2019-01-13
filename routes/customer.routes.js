const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const customer = require('../controllers/customer.controller');

router.get("/RegisteredCustomer", customer.viewListOfCustomers);

module.exports = router;
