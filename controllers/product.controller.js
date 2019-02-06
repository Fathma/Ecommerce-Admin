//Imports
var mongo = require("mongodb");
const Product = require("../models/Product");
const Brand = require("../models/brand.model");
const SubCategory = require("../models/subCategory.model");
const Feature = require("../models/features.model");
const Inventory = require("../models/inventory.model");
const Category = require("../models/category.model");
const Live = require("../models/live.model");
const allFuctions = require("../functions/allFuctions");
const multer = require("multer");
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var includes = require('array-includes');


const mongoo = 'mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db';

const conn = mongoose.createConnection(mongoo);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
})
var filename;
// create storage engine
const storage = new GridFsStorage(
  {
    url: mongoo,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) { return reject(err); }
          filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'fs'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });

// get low quantity
exports.lowLiveQuantity= (req, res, next) => {
  Live.find({quantity:{$lt:3}})
    .exec(function(err, docs) {
      if (err) { res.send(err); }
      var count=0;
      if(docs.length != 0){
        count++;
      }
      res.json({quantity: docs.length, count:count})
    });
};

// get low quantity details
exports.lowLiveQuantityDetails= (req, res, next) => {
  allFuctions.get_all_inventory_list({live:{$lt:3}},{},(docs)=>{
    res.render("products/allProductView", {
      title: "All Product",
      products: docs
    });
  })
};

// get lot without serial page
exports.showDashboard= (req, res, next) => {
  Live.find({quantity:{$lt:3}})
    .exec(function(err, docs) {
      if (err) { res.send(err); }
      res.render("dashboard",{lowlive:docs.length, data: docs});
    });
};

// get lot without serial page
exports.saveInventoryNoSerialPage= (req, res, next) => {
  res.render("addNewLotNoSerial");
};

// get Registration page
exports.showProductRegistrationFieldspage= (req, res, next) => {
  res.render("products/reg");
};

// get new lot page
exports.newLot= (req, res, next) => {
  allFuctions.find({_id: req.params.id}, function(rs){
    res.render("addNewLot", {product:rs[0]});
  })
};

// get live stock edit page
exports.getLiveStockEditpage= (req, res, next) => {
  var arr=[]
  allFuctions.get_inventory_list({product_id:req.params.pid},{},"product_id", (rs)=>{
    rs.map((inventory)=>{
    arr.push(inventory.purchasePrice);
    })
    arr.sort();
    allFuctions.get_inventory_list({_id:req.params.id},{},"product_id",(docs)=>{
      res.render("updateLiveStock", {
        title: "All Product",
        inventory: docs[0],
        highest_pp: arr[arr.length-1]
      });
    })
  }) 
};

// get live stock edit page
exports.getRestoreLivepage= (req, res, next) => {
    Live.find({_id:req.params.id})
    .populate("product_id")
    .exec((err,docs)=>{
      res.render("liveToInventory", {
        title: "Restore live serial",
        live: docs[0]
      });
    })
};

// exports.updateInventory=(req, res, next) => {
//   Inventory.update({_id:req.params.id},{add},(err,docs)=>{
//     res.render("liveToInventory", {
//       title: "Restore live serial",
//       live: docs[0]
//     });
//   })
// };

// this is to get selected serials and restore them in inventory and update the remaining live quantity 
exports.getRestoreLive= (req, res, next) => {
  var live_serials=(req.body.serial).split(",");
  Live.findOneAndUpdate({_id:req.params.id},{ $pull:{serial:{$in:live_serials}} , quantity:parseInt(req.body.live_quantity)-1},(err,docs)=>{
    var inventories = docs.inventory;
    inventories.map((rs)=>{
      Inventory.find({_id: rs}, (err,inventory)=>{
        live_serials.map((selected_serial)=>{
          if(includes(inventory[0].original_serial, selected_serial)){
            console.log(inventory[0].remaining)
            console.log(inventory[0].live)
            Inventory.update({_id: rs}, { $addToSet:{ "serial":selected_serial}, remaining:inventory[0].remaining+1,  live: inventory[0].live-1}, (err,result)=>{
              res.redirect("/products/RestoreLivepage/"+req.body.liveId);
            })
          }
        })
      })
    })
  })
};

// returns allproduct page
exports.getAllProducts = (req, res, next) => {
  Inventory.find()
    .sort({ "product_id": 1 })
    .populate("product_id")
    .populate("live_id")
    .exec(function(err, docs) {
      if (err) { res.send(err); }
  
      res.render("products/allProductView", {
        title: "All Product",
        products: docs
      });
    });
};

// returns Edit page from product info
exports.getEditpage = (req, res, next) => {
  allFuctions.find({ _id: mongo.ObjectID(req.params.id) }, (docs)=>{
    res.render("products/update", {
      title: "Update Product",
      product: docs[0],
      num_feature: docs[0].features.length
    });
  })
};

// returns product offline stock
exports.makeNotActive = (req, res, next) => {
  var obj = { isActive: false };
  allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
    res.redirect("/products/view");
  });
};

// makes product online
exports.makeActive = (req, res, next) => {
  var obj = { isActive: true };
  allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
    res.redirect("/products/view");
  });
};

// returns product Enable
exports.makeEnable = (req, res, next) => {
  var obj = { status: false };
  allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
    res.redirect("/products/view");
  });
};

// makes product Disable
exports.makeDisable = (req, res, next) => {
  var obj = { status: true };
  allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
    res.redirect("/products/view");
  });
};

// returns Edit stock page
exports.getEditStockPage = (req, res, next) => {
  allFuctions.get_inventory_list({ _id: req.params.id }, {}, "product_id", (docs)=>{
    res.render("editStockInfo", {
      title: "Update Stock Info",
      product: docs[0]
    });
  })
};

// getting product models by Category
exports.getProductByCat = (req, res, next)=>{
  allFuctions.find({category: req.params.cat},(rs)=>{
    res.render("addNewLot", {product:rs});
  })
};

// getting product models by Sub category
exports.getProductBySubcat = (req, res, next)=>{
  allFuctions.find({subcategory: req.params.sub_cat},(rs)=>{
    res.render("addNewLot", {product:rs});
  })
};

// getting product models by Category
exports.getProductByCatNoSerial = (req, res, next)=>{
  allFuctions.find({category: req.params.cat},(rs)=>{
    res.render("addNewLotNoSerial", {product:rs});
  })
};

// getting product models by Sub category
exports.getProductBySubcatNoSerial = (req, res, next)=>{
  allFuctions.find({subcategory: req.params.sub_cat},(rs)=>{
    res.render("addNewLotNoSerial", {product:rs});
  })
};

// returns Online Product page
exports.getOnlineProductsPage = (req, res, next) => {
  var populate_obj = {
    path:"product_id",
    match: { isActive:true }
  };
  allFuctions.get_inventory_list({},{ "product_id": 1 },populate_obj,(rs)=>{
    console.log(rs)
    res.render("products/allProductView", {
      title: "Offline Products",
      products: rs
    });
  })
};

// returns Offline Product page
exports.getOfflineProductsPage = (req, res, next) => {
  var populate_obj = {
    path:"product_id",
    match: { isActive:false }
  };
  allFuctions.get_inventory_list({},{ "product_id": 1 },populate_obj,(rs)=>{
    res.render("products/allProductView", {
      title: "Offline Products",
      products: rs
    });
  })
};

// shows the number of fields user wants
exports.showProductRegistrationFields = (req, res, next) => {
  var category=(req.body.categg).split(",");
  var subcategory=(req.body.subCategg).split(",");
  var brand=(req.body.brandg).split(",");
  var obj=[
    {category: category[0]},
    {brand: brand[0]}
  ]

  if (req.body.subCategg != "0") {
    obj.push({subcategory: subcategory[0]});
    var sub= subcategory[0];
  }else{
    var sub="null";
  }
 
  Feature.find({$and:obj},function(err, docs1) {
    var render_obj ={
      title: "Registration",
      brands:brand[0],
      catt:category[0],
      sub:sub,
      brandN:brand[1],
      cattN:category[1],
      subN:subcategory[1],
      submitted:true
    }
    
    if(docs1 === undefined || docs1.length === 0){
      render_obj.num = 0;
      render_obj.status ="notexist";
     
    }else{
      render_obj.num = 0;
      render_obj.status ="exist";
      render_obj.features = docs1[0].feature;
    }
    res.render("products/reg", render_obj);
  });
};

// save live
exports.saveLive = (req, res, next) => {
   var serial_obj= (req.body.serial).split(",");
   var live = {
     product_id:req.params.id,
     quantity:req.body.quantity,
     purchasePrice: req.body.purchase_price,
     serial: serial_obj,
     unitPrice:req.body.unit_price,
     inventory:req.body.lot_number,
     admin: req.user._id,
     original_serial: serial_obj
   }
   Live.find({product_id:req.params.id}, function(err,rs){
 
     if(err){ console.log(err)}
     console.log("SDF")
     if(rs.length===0 || rs.length === undefined){
       new Live(live).save().then(live => {
        console.log(live);
          allFuctions.changeStatus({_id:req.params.id},{ "live": live._id, unitPrice: req.body.unit_price }, res, (docs2)=>{
            console.log(req.body.lot_number)
            Inventory.update({_id:req.body.lot_number}, { $pull: { serial: { $in: serial_obj }},
              "remaining":(parseInt(req.body.remaining)-req.body.quantity),"unitPrice":req.body.unit_price, "live":req.body.quantity, live_id: live._id },{ upsert: true },
              function(err, docs){
              if(err){ console.log(err);}
              console.log("SDF")
              req.flash("success_msg", "Live Product Added");
              res.redirect("/Products/liveStockEdit/"+req.body.lot_number+"/"+req.params.id);
            }) 
          }
       ) 
      });
      }else{
       
        Live.update({product_id:req.params.id},{ $addToSet:{ "serial":serial_obj},unitPrice:req.body.unit_price, quantity: parseInt(rs[0].quantity)+parseInt(req.body.quantity)},{ upsert: true },
          function(err1, docs1) {
          if(err1){res.send(err1)}
          allFuctions.changeStatus({_id:req.params.id},{ "live": rs[0]._id , unitPrice: req.body.unit_price }, res, (docs2)=>{
            Inventory.update({_id:req.body.lot_number}, { $pull: { serial: { $in: serial_obj }},
            "remaining":(parseInt(req.body.remaining)-req.body.quantity), "unitPrice":req.body.unit_price,live_id: docs1._id,
            "live_id":rs[0]._id, "live": parseInt(rs[0].quantity)+parseInt(req.body.quantity) },{ upsert: true },
            function(err, docs){
              if(err){ res.send(err) }
              Inventory.update({product_id: req.params.id},{"unitPrice":req.body.unit_price, "live": parseInt(rs[0].quantity)+parseInt(req.body.quantity) },
              {multi: true}, function(err,docs3){
                if(err){res.send(err)}
                req.flash("success_msg", "Live Product Added");
                res.redirect("/Products/liveStockEdit/"+req.body.lot_number+"/"+req.params.id);
              })
             
            }) 
          }
        ) 
      });
      }
   })
 };

// get lot without serial page
exports.saveInventoryNoSerial= (req, res, next) => {
  var inventory = {
    product_id:req.body.model,
    stockQuantity:req.body.quantity,
    purchasePrice: req.body.purchase_price,
    remaining: req.body.quantity,
    admin: req.user._id,
  }
  Live.find({product_id:req.body.model}, (rs)=>{
    console.log(rs)
    if(rs){
      inventory.live_id=rs[0]._id;
      inventory.live=rs[0].quantity;
      inventory.unitPrice = rs[0].unitPrice;
    }
    new Inventory(inventory).save().then(inventory => {
      res.redirect("/products/saveInventoryNoSerialPage");
    });
  })
};

exports.check_availablity= (req, res, next) => {

  var pre_arr="";
  allFuctions.get_all_inventory_list({product_id:req.params.model},{},(rs)=>{
    rs.map((inventory)=>{
      var ser=inventory.serial;
      for(var i=0;i<ser.length;i++){
        pre_arr += ser[i]
        if(i <ser.length-1){
          pre_arr +=","
        }
      }
    })
    res.json({data:pre_arr});
})
}
// Save Inventory
exports.saveInventory = (req, res, next) => {
  var serials= (req.body.serial).split(",");
    var inventory = {
      product_id:req.body.model,
      stockQuantity:req.body.quantity,
      purchasePrice: req.body.purchase_price,
      remaining: req.body.quantity,
      serial: serials,
      original_serial:serials,
      admin: req.user._id,
    }
   
    new Inventory(inventory).save().then(inventory => {
        res.json({})
    });
};

//saves product details
exports.SaveProduct= (req, res, next) => {
  var selected_brand= req.body.brand;
  var selected_category= req.body.catt;

  // checking whether first form has submitted or not
  if(req.body.catt != "" && selected_brand != ""){
    var selected_subCategory = req.body.sub;
    var num = parseInt(req.body.num, 10);
    var data = [];
    var features_new = [];
    var obj=[
      {category:selected_category},
      {brand:selected_brand}
    ] ;
    // getting previously added feature and corresponding values
    if (num > 0) {
      if(req.body.feature0_value === ""){}else{
        data.push(JSON.parse("{\"label\":\"" + req.body.feature0_label + "\",\"value\":\"" + req.body.feature0_value + "\"}"));
      }
      if (num > 1) {
        if(req.body.feature1_value === ""){}else{
          data.push(JSON.parse("{\"label\":\"" + req.body.feature1_label + "\",\"value\":\"" + req.body.feature1_value + "\"}"));
        }
        if (num > 2) {
          if(req.body.feature2_value === ""){}else{
            data.push(JSON.parse("{\"label\":\"" + req.body.feature2_label + "\",\"value\":\"" + req.body.feature2_value + "\"}"));
          }
          if (num > 3) {
            if(req.body.feature3_value === ""){}else{
              data.push(JSON.parse("{\"label\":\"" + req.body.feature3_label + "\",\"value\":\"" + req.body.feature3_value + "\"}"));
            }
            if (num > 4) {
              if(req.body.feature4_value === ""){}else{
                data.push(JSON.parse("{\"label\":\"" + req.body.feature4_label + "\",\"value\":\"" + req.body.feature4_value + "\"}"));
              }
              if (num > 5) {
                if(req.body.feature5_value === ""){}else{
                  data.push(JSON.parse("{\"label\":\"" + req.body.feature5_label + "\",\"value\":\"" + req.body.feature5_value + "\"}"));
                }
                if (num > 6) {
                  if(req.body.feature6_value === ""){}else{
                    data.push(JSON.parse("{\"label\":\"" + req.body.feature6_label + "\",\"value\":\"" + req.body.feature6_value + "\"}"));
                  }
                  if (num > 7) {
                    if(req.body.feature7_value === ""){}else{
                      data.push(JSON.parse("{\"label\":\"" + req.body.feature7_label + "\",\"value\":\"" + req.body.feature7_value + "\"}"));
                    }
                    if (num > 8) {
                      if(req.body.feature8_value === ""){}else{
                        data.push(JSON.parse("{\"label\":\"" + req.body.feature8_label + "\",\"value\":\"" + req.body.feature8_value + "\"}"));
                      }
                      if (num > 9) {
                        if(req.body.feature9_value === ""){}else{
                          data.push(JSON.parse("{\"label\":\"" + req.body.feature9_label + "\",\"value\":\"" + req.body.feature9_value + "\"}"));
                        }
                        if (num > 10) {
                          if(req.body.feature10_value === ""){}else{
                            data.push(JSON.parse("{\"label\":\"" + req.body.feature10_label + "\",\"value\":\"" + req.body.feature10_value + "\"}"));
                          }
                          if (num > 11) {
                            if(req.body.feature11_value === ""){}else{
                              data.push(JSON.parse("{\"label\":\"" + req.body.feature11_label + "\",\"value\":\"" + req.body.feature11_value + "\"}"));
                            }
                            if (num > 12) {
                              if(req.body.feature12_value === ""){}else{
                                data.push(JSON.parse("{\"label\":\"" + req.body.feature12_label + "\",\"value\":\"" + req.body.feature12_value + "\"}"));
                              }
                              if (num > 13) {
                                if(req.body.feature13_value === ""){}else{
                                  data.push(JSON.parse("{\"label\":\"" + req.body.feature13_label + "\",\"value\":\"" + req.body.feature13_value + "\"}"));
                                }
                                if (num > 14) {
                                  if(req.body.feature14_value === ""){}else{
                                    data.push(JSON.parse("{\"label\":\"" + req.body.feature14_label + "\",\"value\":\"" + req.body.feature14_value + "\"}"));
                                  }
                                  if (num > 15) {
                                    if(req.body.feature15_value === ""){}else{
                                      data.push(JSON.parse("{\"label\":\"" + req.body.feature15_label + "\",\"value\":\"" + req.body.feature15_value + "\"}"));
                                    }
                                    if (num > 16) {
                                      if(req.body.feature16_value === ""){}else{
                                        data.push(JSON.parse("{\"label\":\"" + req.body.feature16_label + "\",\"value\":\"" + req.body.feature16_value + "\"}"));
                                      }
                                      if (num > 17) {
                                        if(req.body.feature17_value === ""){}else{
                                          data.push(JSON.parse("{\"label\":\"" + req.body.feature17_label + "\",\"value\":\"" + req.body.feature17_value + "\"}"));
                                        }
                                        if (num > 18) {
                                          if(req.body.feature18_value === ""){}else{
                                            data.push(JSON.parse("{\"label\":\"" + req.body.feature18_label + "\",\"value\":\"" + req.body.feature18_value + "\"}"));
                                          }
                                          if (num > 19) {
                                            if(req.body.feature19_value === ""){}else{
                                              data.push(JSON.parse("{\"label\":\"" + req.body.feature19_label + "\",\"value\":\"" + req.body.feature19_value + "\"}"));
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  var pro = new Promise(function (resolve, reject) {
    // getting saved image and converting into base64 String 
    const readstream = gfs.createReadStream(req.file.filename);
    readstream.on('data', (chunk) => {
      arr = chunk.toString('base64');
      resolve();
    })
  })
  pro.then(()=>{
    if( selected_subCategory != "0"){
      obj.push({subcategory: selected_subCategory})
    } 
  })
  pro.then(()=>{
    // getting newly added features and updating to feature collection and the feature 
    // and value is being stored in data[] whic will be added in product collection
    if(req.body.new_feat > 0){
      data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_1 + "\",\"value\":\"" + req.body.v1 + "\"}"));
      features_new.push(req.body.new_feat_1);
        if(req.body.new_feat > 1){
          data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_2 + "\",\"value\":\"" + req.body.v2 + "\"}"));
          features_new.push(req.body.new_feat_2);
          if(req.body.new_feat > 2){
            data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_3 + "\",\"value\":\"" + req.body.v3 + "\"}"));
            features_new.push(req.body.new_feat_3);
            if(req.body.new_feat > 3){
              data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_4 + "\",\"value\":\"" + req.body.v4 + "\"}"));
              features_new.push(req.body.new_feat_4);
              if(req.body.new_feat > 4){
                data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_5 + "\",\"value\":\"" + req.body.v5 + "\"}"));
                features_new.push(req.body.new_feat_5);
                if(req.body.new_feat > 5){
                  data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_6 + "\",\"value\":\"" + req.body.v6 + "\"}"));
                  features_new.push(req.body.new_feat_6);
                  if(req.body.new_feat > 6){
                    data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_7 + "\",\"value\":\"" + req.body.v7 + "\"}"));
                    features_new.push(req.body.new_feat_7);
                    if(req.body.new_feat > 7){
                      data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_8 + "\",\"value\":\"" + req.body.v8 + "\"}"));
                      features_new.push(req.body.new_feat_8);
                      if(req.body.new_feat > 8){
                        data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_9 + "\",\"value\":\"" + req.body.v9 + "\"}"));
                        features_new.push(req.body.new_feat_9);
                        if(req.body.new_feat > 9){
                          data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_10 + "\",\"value\":\"" + req.body.v10 + "\"}"));
                          features_new.push(req.body.new_feat_10);                                     
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }) 
  pro.then(() => {
    Feature.update({$and:obj},{ $addToSet:{ "feature": { $each: features_new }}},{ upsert: true },function(err, docs){
      if(err){ console.log(err)}
    })
  })           
  pro.then(() => {
    var newProduct = {
      name: req.body.title,
      category: selected_category,
      image: arr,
      admin: req.user.id,
      brand: selected_brand,
      model: req.body.model,
      warranty: req.body.warranty,
      description: req.body.description,
      shippingInfo: req.body.shippingInfo,
      features: data,
      categoryName: req.body.cattN,
      subcategoryName:  req.body.subN,
      brandName: req.body.brandN
    };
    
    if( req.body.sub === "null" ){}
    else{
      newProduct.subcategory= req.body.sub
    }
    
    new Product(newProduct).save().then(product => {
    Category.update(
      { _id: selected_category },
      { $addToSet: { brands: selected_brand} },
      { upsert: true },
      function(err, docs) {
        if (err) { res.send(err); }
        if (req.body.sub === "null") {}
        else{
          SubCategory.update(
            { _id: req.body.sub },
            { $addToSet: { brands: selected_brand}, category: selected_category  },
            { upsert: true },
            function(err, docs) {
              if (err) { res.send(err); }
          });
        } 
      }
    );
  });
  })
  pro.then(() => {
    gfs.remove({ filename: req.file.filename }, (err) => {
      if (err) req.flash("error_msg", "Something went wrong! Try again.");
      res.redirect("/category/Entry");
    })
  })
  }else{
    req.flash("error_msg", "please submit the form with category,sub category and brand before filling product info!");
    res.redirect("/category/Entry");
  }
};

// // single product view
// exports.singleProduct = (req, res) => {
//   Product.find({_id:req.params.id})
//     .populate("brand")
//     .populate("admin")
//     .populate("subcategory")
//     .populate("category")
//     // .populate({
//     //   path: "subcategory",
//     //   populate: { path: "category" }
//     // })
//     .exec(function(err, product) {
//       console.log("DFGDF")
//       console.log(err)
//       var obj = resultArray.features;
//       res.render("single", {
//         title: "Single",
//         product: product,
//         features: obj
//       });
//     });
// };

// // returns setDiscount page
// exports.addDiscountpage = (req, res, next)=>{
//   allFuctions.find({_id: req.params.id},function(rs){
//     res.render("setDiscount", {id: req.params.id, products:rs[0]});
//   })
// }

// exports.addLotPage= (req, res, next) => {
//   res.render("addNewLot");
// };

// // returns setDiscount to the selected product
// exports.addDiscount = (req, res, next)=>{
  
//   allFuctions.find({_id: req.params.id}, function(rs){

//     var listPrice = rs[0].productPrice.listPrice;
//     var with_discount = listPrice-((req.body.discount/100)*listPrice);

//     if(with_discount <= rs[0].productPrice.wholeSalePrice ){

//       req.flash('error_msg', "Discounted price is less than the wholesale price!");
//       var obj = {'productPrice.salePrice': Number((with_discount).toFixed(0)), onSale:true};
//       changeStatus(req, res, obj);
//       res.redirect('/products/view');

//     }else{
//       var obj = {'productPrice.salePrice': Number((with_discount).toFixed(0)), onSale:true };
//       changeStatus(req, res, obj);
//       res.redirect('/products/view');
//     }
//   })
// }

// // function for updateting category table
// function update_category(condition, values, cb){
//   Category.update(condition,values,{ upsert: true },function(err, docs){
//       if(err){ console.log(err)}
//     }
//   ) 
// }
// function update_subcategory(condition, values, cb){
//   Category.update(condition,values,{ upsert: true },function(err, docs){
//       if(err){ console.log(err)}
//     }
//   ) 
// }

// // adds to the sale list
// exports.makeOnSale = (req, res, next) => {

//   var obj = { onSale: true };
//   changeStatus(req, res, obj);
//   res.redirect("/products/Online/" + req.params.cid);

// };

// // returns Remove product sale
// exports.removeFromSale = (req, res, next) => {

//   var obj = { 
//     onSale: false,
//     'productPrice.salePrice': null
//   };
//   changeStatus(req, res, obj);
//   res.redirect("/products/view");
// };

// // returns Sale Products Page
// exports.getSaleProductsPage = (req, res, next) => {
//   var obj = { onSale: true };
//   find(obj, function(rs) {
//     res.render("products/allProductView", {
//       title: "Sale Product",
//       products: rs
//     });
//   });
// };


// // delete product
// exports.deleteProduct = (req, res, next) => {
//   Product.deleteOne({ _id: mongo.ObjectID(req.params.id) }, function(err,bear) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.redirect("/products/view");
//     }
//   });
// };

// returns all product with stock info page
// exports.getAllProductStock = (req, res, next) => {

//   var resultArray = [];
//   Product.find()
//   .sort({ "quantity.stock": -1 })
//   .populate("subcategory")
//   .populate("quantity.userID")
//   .exec(function(err, docs) {
//     if (err) {
//       res.send(err);
//     } else {
//       for (var i = docs.length - 1; i > -1; i -= 1) {
//         resultArray.push(docs[i]);
//       }
//     }
//     res.render("stock", {
//       title: "Stock",
//       products: resultArray
//     });
//   });

// };
