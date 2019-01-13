const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const invoice = require('../controllers/invoice.controller');

router.get("/invoiceList", invoice.showInvoiceList);


module.exports = router;