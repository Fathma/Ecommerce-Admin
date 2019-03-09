const express = require('express');
const router = express.Router();

const category = require('../controllers/category.controller');

router.get("/Entry", category.addAllPage);
router.post("/Entry", category.addAllPage);
router.post("/addCategory", category.addCategory);
router.post("/addSubCategory", category.addSubCategory);
router.post("/addBrand", category.addBrand);
router.get("/getSub/:cat", category.getSub);
router.get("/getBrands/:subcat", category.getBrand);

module.exports = router;
