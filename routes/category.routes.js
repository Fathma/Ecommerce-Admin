const express = require('express')
const router = express.Router()

const category = require('../controllers/category.controller')

router.post('/addCategory', category.addCategory)
router.post('/addSubCategory', category.addSubCategory)
router.post('/addBrand', category.addBrand)
router.get('/getSub/:cat', category.getSub)
router.get('/getSub2/:cat', category.getSub2)
router.get('/getBrands/:subcat', category.getBrand)
router.get('/getBrands2/:cat', category.getBrand2)
module.exports = router
