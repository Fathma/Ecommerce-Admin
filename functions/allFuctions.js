const Product = require("../models/Product");
const Brand = require("../models/brand.model");
const SubCategory = require("../models/subCategory.model");
const Feature = require("../models/features.model");
const Inventory = require("../models/inventory.model");
const Category = require("../models/category.model");
const Order = require("../models/customerOrder");

// get inventory list by filter
exports.get_inventory_list_new = async (condition, sort_obj, populate_obj) => {
  return await Inventory.find(condition).sort(sort_obj).populate(populate_obj)
};



// get inventory list by filter
exports.get_all_inventory_list = (condition, sort_obj, cb) => {
  Inventory.find(condition).sort(sort_obj).populate("product_id").populate("admin").exec((err, rs)=>{ cb(rs); });
};

//find fuction from product collection
exports.find = (obj, cb) => {
  Product.find(obj).populate("brand").populate("admin").populate("subcategory").populate("category").exec(function(err, docs) { cb(docs); });
};

// update function
exports.changeStatus = (condition,  object, res, cb) => {
  Product.findOneAndUpdate(condition,{ $set: object },{ upsert: true }, function(err, docs) {
      if (err) { res.send(err); }
      cb(docs)
    }
  );
};

// adds the live and remaining
exports.get_inventories_total = (docs,cb)=>{
  var arr=[];
  docs.map((rs)=>{
    rs.total = rs.remaining+rs.live;
    arr.push(rs)
  })
  cb(arr);
}

// orders
exports.get_orders = (condition, cb)=>{
  Order.find(condition).sort({ "created": 1 }).populate("cart.product").populate("user").exec((err, rs)=>{ cb(rs); })
}

// exports.update_live = async (condition, setvalue) =>{
//   return await Product.update(condition, setvalue , {upsert:true})
// }

// function for getting live data
exports.get_live = async (condition)=>{
  return await Product.find(condition)
}

