const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const returns = require('../controllers/return.controller');

router.get("/returnList", returns.showReturnList);


module.exports = router;