const Product = require("../models/Product");
const Brand = require("../models/brand.model");
const SubCategory = require("../models/subCategory.model");
const Feature = require("../models/features.model");
const Inventory = require("../models/inventory.model");
const Category = require("../models/category.model");
const Live = require("../models/live.model");

// get inventory list by filter
exports.get_inventory_list = (condition, sort_obj, populate_obj, cb) => {
  Inventory.find(condition)
    .sort(sort_obj)
    .populate(populate_obj)
    .populate("live_id")
    .exec(function(err, rs) {
      cb(rs);
    });
};

// get inventory list by filter
exports.get_all_inventory_list = (condition, sort_obj, cb) => {
  Inventory.find(condition)
    .sort(sort_obj)
    .populate("product_id")
    .populate("live_id")
    .populate("admin")
    .exec(function(err, rs) {
      cb(rs);
    });
};

//find fuction from product collection
exports.find = (obj, cb) => {
  console.log(obj);
  Product.find(obj)
    .populate("brand")
    .populate("admin")
    .populate("subcategory")
    .populate("category")
    .exec(function(err, docs) {
      console.log(docs);
      cb(docs);
    });
};

// update function
exports.changeStatus = (condition,  object, res, cb) => {
  Product.findOneAndUpdate(
    condition,
    { $set: object },
    { upsert: true },
    function(err, docs) {
      if (err) { res.send(err); }
      cb(docs)
    }
  );
};
