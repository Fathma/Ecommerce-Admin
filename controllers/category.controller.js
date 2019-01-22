const express = require("express");
const router = express.Router();
const Brand = require("../models/brand.model");
const subCategory = require("../models/subCategory.model");
const Cat = require("../models/category.model");



//new

// category register route
exports.addCategoryPage = (req, res, next) => {
  res.render("products/reg");
};

exports.addCategory = (req, res, next) => {
  category = {
    name: req.body.cat,
    subCategories: [],
    Brands: []
  };
  new Cat(category).save().then(category => {});
  res.redirect("/category/Entry");
};

exports.addBrand = (req, res, next) => {
  //   if (req.body.subCate != "null") {
  //       brand = {
  //   name: req.body.brand,
  //   category: req.body.catee,
  //   subcategory: req.body.subCate,
  //   feature:[]
  // };}
  // else{
  //   brand = {
  //       name: req.body.brand,
  //       category: req.body.catee,
  //       subcategory: null,
  //       feature:[]
  //     };
  // }
  var brand= {
    name:req.body.brand
  }
  new Brand(brand).save().then(brand => {
      // Cat.findOneAndUpdate(
      //   { _id: req.body.catee },
      //   { $addToSet: { Brands: brand._id } },
      //   { upsert: true },
      //   function(err, docs) {
      //     if (err) {
            
      //     }
      //     if (req.body.subCate != "null") {
      //       subCategory.findOneAndUpdate(
      //         { _id: req.body.subCate },
      //         { $addToSet: { brand: brand._id } },
      //         { upsert: true },
      //         function(err, docs) {
      //           if (err) {
      //             res.send(err);
      //           }
      //           res.redirect("/category/Entry");
      //         }
      //       );
      //     } else {
      //       res.redirect("/category/Entry");
      //     }
      //   }
      // );
      res.redirect("/category/Entry");
  });
};
exports.addSubCategory = (req, res, next) => {
  subcategory = {
    name: req.body.subCat,
    Categories: req.body.cate,
    Brands: []
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
          res.redirect("/category/addCategoryPage");
        }
      );
    } else {
      res.redirect("/category/addCategoryPage");
    }
  });
};

//new
// category register route
// exports.addSubCategoryPage = (req, res, next) => {
//     res.render("AddCategory");
// };

// // category register route
// exports.addBrandPage = (req, res, next) => {
//     res.render("brandReg");
// };

// exports.addSuperCategoryPage = (req, res, next) => {
//     res.render("AddSuperCategory");
// };

// exports.addAllPage = (req, res, next) => {
//     subCategory.find()
//     .populate("category")
//     .exec(function(err, docs){
//         if(err){}
//         else{
//             res.render("addAll",{
//                 categ: docs
//             });
//         }
//     })
    
// };

// exports.addbrand = (req, res) => {
//     newBrand = {
//         name: req.body.brand
//     }
//     new Brand(newBrand).save().then(Brand => {
//         req.flash("success_msg", "Brand added.");
//         res.redirect("/products/view");
//     });
// };

exports.addSuperCategory = (req, res) => {
    newCategory = {
        name: req.body.super
    }
    new Category(newCategory).save().then(Category => {
        console.log(Category);
        req.flash("success_msg", "Category added.");
        res.redirect("/products/view");
    });
};

// exports.addCategory = (req, res) => {
//     newBrand = {
//         name: req.body.brand
//     }
//     new Brand(newBrand).save().then(Brand => {
//         Cat.find({name:req.body.cat}, function(err, docs){
//             if(err){}
//             else{
//                 console.log(docs.length);
//                 if(docs.length === 0){
//                     newSuperCategory = {
//                         name: req.body.cat
//                     }
//                     new Category(newSuperCategory).save().then(Category => {
//                         var feature = (req.body.feat).split(",");
//                         newSubCategory = {
//                             name: req.body.subCat,
//                             category:Category,
//                             features: feature
//                         }
//                         new subCategory(newSubCategory).save().then(SubCategory => {
//                             req.flash("success_msg", "Sub Category added.");
//                             res.redirect("/products/showfields");
//                         });
//                     }); 
//                 }
//                 else{
//                     var feature = (req.body.feat).split(",");
//                     newSubCategory = {
//                         name: req.body.subCat,
//                         category: docs[0]._id,
//                         features: feature
//                     }
//                     new subCategory(newSubCategory).save().then(SubCategory => {
//                         req.flash("success_msg", "Sub Category added.");
//                         res.redirect("/products/showfields");
//                     });
//                 }
//             }
//         })
//     });
    
    
  
    
// };

const Category = require("../models/category.model");