const express = require("express");
const router = express.Router();
const Brand = require("../models/brand.model");
const subCategory = require("../models/subCategory.model");
const Cat = require("../models/category.model");

// category register route
exports.addSubCategoryPage = (req, res, next) => {
    res.render("AddCategory");
};

// category register route
exports.addBrandPage = (req, res, next) => {
    res.render("brandReg");
};

exports.addSuperCategoryPage = (req, res, next) => {
    res.render("AddSuperCategory");
};

exports.addAllPage = (req, res, next) => {
    subCategory.find()
    .populate("category")
    .exec(function(err, docs){
        if(err){}
        else{
            res.render("addAll",{
                categ: docs
            });
        }
    })
    
};

exports.addbrand = (req, res) => {
    newBrand = {
        name: req.body.brand
    }
    new Brand(newBrand).save().then(Brand => {
        req.flash("success_msg", "Brand added.");
        res.redirect("/products/view");
    });
};

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

exports.addCategory = (req, res) => {
    newBrand = {
        name: req.body.brand
    }
    new Brand(newBrand).save().then(Brand => {
        Cat.find({name:req.body.cat}, function(err, docs){
            if(err){}
            else{
                console.log(docs.length);
                if(docs.length === 0){
                    newSuperCategory = {
                        name: req.body.cat
                    }
                    new Category(newSuperCategory).save().then(Category => {
                        var feature = (req.body.feat).split(",");
                        newSubCategory = {
                            name: req.body.subCat,
                            category:Category,
                            features: feature
                        }
                        new subCategory(newSubCategory).save().then(SubCategory => {
                            req.flash("success_msg", "Sub Category added.");
                            res.redirect("/products/showfields");
                        });
                    }); 
                }
                else{
                    var feature = (req.body.feat).split(",");
                    newSubCategory = {
                        name: req.body.subCat,
                        category: docs[0]._id,
                        features: feature
                    }
                    new subCategory(newSubCategory).save().then(SubCategory => {
                        req.flash("success_msg", "Sub Category added.");
                        res.redirect("/products/showfields");
                    });
                }
            }
        })
    });
    
    
  
    
};

const Category = require("../models/category.model");