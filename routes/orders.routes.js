const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const orders = require('../controllers/orders.controller');

router.get("/orders", orders.showOrdersPage);
router.get("/orderDetails", orders.showOrderDetails);

module.exports = router;