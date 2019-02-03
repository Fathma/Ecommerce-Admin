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
    .exec(function(err, rs) {
      cb(rs);
    });
};

// update Inventory
exports.updateInventory= (condition, obj, cb)=>{
  Inventory.update(condition, obj , { upsert: true },
    function(err, docs){
    if(err){ res.send(err)}
    cb(docs);
  })
}

//find fuction from product collection
exports.find = (obj, cb) => {
  Product.find(obj)
    .populate("brand")
    .populate("admin")
    .populate("subcategory")
    .populate("category")
    .exec(function(err, docs) {
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
