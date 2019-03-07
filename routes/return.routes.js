const express = require('express');
const router = express.Router();

const returns = require('../controllers/return.controller');

router.get("/returnList", returns.showReturnList);
router.get("/returnDetails", returns.showReturnDetails);
router.get("/addReturn", returns.addReturnPage);

module.exports = router;