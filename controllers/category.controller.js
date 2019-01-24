const express = require("express");
const router = express.Router();
const Brand = require("../models/brand.model");
const subCategory = require("../models/subCategory.model");
const Cat = require("../models/category.model");

// All registration page
exports.addAllPage = (req, res, next) => {
  res.render("products/reg");
};

// saving category 
exports.addCategory = (req, res, next) => {
  var category = {
    name: req.body.cat,
    subCategories: [],
    brands: []
  };
  new Cat(category).save().then(category => {});
  res.redirect("/category/Entry");
};

// Saving Sub Category 
exports.addSubCategory = (req, res, next) => {
  var subcategory = {
    name: req.body.subCat,
    category: req.body.cate,
    brands: []
  };
  new subCategory(subcategory).save().then(subcategory => {
    if (req.body.cate != "null") {
      Cat.findOneAndUpdate(
        { _id: req.body.cate },
        { $addToSet: { subCategories: subcategory._id } },
        { upsert: true },
        function(err, docs) {
          if (err) {
            res.send(err);
          }
          res.redirect("/category/Entry");
        }
      );
    } else {
      res.redirect("/category/Entry");
    }
  });
};

// Saving Brand
exports.addBrand = (req, res, next) => {
  var brand= {
    name:req.body.brand
  }
  new Brand(brand).save().then(brand => {
      res.redirect("/category/Entry");
  });
};

// getting sub categories on the basis of category 
exports.getSub = (req, res, next) => {
  Cat.find({_id: req.params.cat})
    .populate("subCategories")
    .exec(function(err, docs){
    res.json(docs)
  })
};

