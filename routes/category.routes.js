const express = require('express');
const router = express.Router();



// Require the controllers WHICH WE DID NOT CREATE YET!!
const category = require('../controllers/category.controller');

router.post("/AddSuperCategory", category.addSuperCategory);
router.post("/addAll", category.addCategory);
router.get("/AddAllPage", category.addAllPage);
router.post("/AddSubCategory", category.addCategory);
router.get("/addCategoryPage", category.addSuperCategoryPage);
router.get("/addBrandPage", category.addBrandPage);
router.post("/AddBrand", category.addbrand);
router.get("/addSubCategoryPage", category.addSubCategoryPage);

module.exports = router;
