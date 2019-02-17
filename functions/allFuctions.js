const Product = require("../models/Product");
const Brand = require("../models/brand.model");
const SubCategory = require("../models/subCategory.model");
const Feature = require("../models/features.model");
const Inventory = require("../models/inventory.model");
const Category = require("../models/category.model");
const Live = require("../models/live.model");
const Order = require("../models/customerOrder");



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

// adds the live and remaining
exports.get_inventories_total=(docs,cb)=>{
  var arr=[];
  docs.map((rs)=>{
    rs.total = rs.remaining+rs.live;
    arr.push(rs)
  })
  cb(arr);
}

// orders
exports.get_orders = (condition, cb)=>{
  Order.find(condition)
  .sort({ "created": 1 })
  // .populate('cart.product')
  .populate({
      path: "cart.product",
      populate: { path: "live" }
    })
  .populate("user")
  .exec((err, rs)=>{
     cb(rs);
  })
}

// exports.check_availablity= (req, res, next) => {
  //   var pre_arr=[];
  //   allFuctions.get_all_inventory_list({product_id:req.body.model},{},(rs)=>{
  //     rs.map((inventory)=>{
  //       var ser=inventory.serial;
  //       ser.map((serial)=>{
  //         pre_arr.push(serial);
  //       })
  //     })
  //   var serials= (req.body.serial).split(",");
  //   var exist_serials="";
  //   serials.map((serial)=>{
  //     if(pre_arr.includes(serial)){
  //       exist_serials +=serial+" ";
  //     }
  //   })
  //   if(exist_serials.length === 0){
  //     res.json({data:true})
  //   }else{
  //     res.json({data:false})
  //   }
  
  // })
  // }