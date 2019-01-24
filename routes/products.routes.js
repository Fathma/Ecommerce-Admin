const express = require('express');
const router = express.Router();
const Product = require("../models/Product");
const SubCategory = require("../models/subCategory.model");
const multer = require("multer");
const { ensureAuthenticated } = require("../helpers/auth");
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
var mongo = require('mongodb');
var Brand = require("../models/brand.model");
var Feature = require("../models/features.model");
var Cat = require("../models/category.model");


const product_controller = require('../controllers/product.controller');

mongoose.Promise = global.Promise;


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
          if (err) {
            return reject(err);
          }
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


router.get("/delete/:id", ensureAuthenticated, product_controller.deleteProduct);
// router.get("/showfields/:cat", ensureAuthenticated, product_controller.showProductRegistrationFields);
// router.get("/showfields", ensureAuthenticated, product_controller.showProductRegistrationFieldspage);

router.get("/singleProduct/:id", product_controller.singleProduct);
router.get("/Edit/:id", product_controller.getEditpage);
router.get("/stock", product_controller.getAllProductStock);

router.get("/stockEditPage", product_controller.addLotPage);

router.get("/Online", product_controller.getOnlineProductsPage);
router.get("/offline", product_controller.getOfflineProductsPage);
router.get("/active/:id/:cid", product_controller.makeActive);
router.get("/unactive/:id", product_controller.makeNotActive);
router.get("/Sale", product_controller.getSaleProductsPage);

router.get("/RemoveFromSale/:id/:cid", product_controller.removeFromSale);
router.get("/makeSale/:id/:cid", product_controller.makeOnSale);
router.get("/addDiscount/:id/:cid", product_controller.addDiscountpage);

router.post("/stockEdit/:id", product_controller.getEditStock);
router.get("/stockEditPage/:id", product_controller.getEditStockPage);


router.post("/Discount/:id", product_controller.addDiscount);
router.post("/saveSerial/:id", product_controller.saveSerial);

router.get("/liveStockEdit/:id", product_controller.getLiveStockEditpage);

// new
router.post("/saveLive/:id", product_controller.saveLive);
router.get("/view", ensureAuthenticated, product_controller.getAllProducts);
router.get("/newLot", product_controller.newLot);
router.post("/SaveInventory", product_controller.saveInventory);
router.get("/getProductBySubcat/:sub_cat", product_controller.getProductBySubcat);
router.get("/getProductByCat/:cat", product_controller.getProductByCat);
router.post("/showfields", ensureAuthenticated, product_controller.showProductRegistrationFields);
router.post("/regiSave",upload.single("imagePath"), product_controller.SaveProduct);

// update product information
router.post("/update/:pid/:feat_num", upload.single("image"), (req, res, next) => {

  var num = parseInt(req.params.feat_num, 10);
  var data = [];
  
  if (num > 0) {
    data.push(JSON.parse("{\"label\":\"" + req.body.feature0_label + "\",\"value\":\"" + req.body.feature0_value + "\"}"));
    if (num > 1) {
      data.push(JSON.parse("{\"label\":\"" + req.body.feature1_label + "\",\"value\":\"" + req.body.feature1_value + "\"}"));
      if (num > 2) {
        data.push(JSON.parse("{\"label\":\"" + req.body.feature2_label + "\",\"value\":\"" + req.body.feature2_value + "\"}"));
        if (num > 3) {
          data.push(JSON.parse("{\"label\":\"" + req.body.feature3_label + "\",\"value\":\"" + req.body.feature3_value + "\"}"));
          if (num > 4) {
            data.push(JSON.parse("{\"label\":\"" + req.body.feature4_label + "\",\"value\":\"" + req.body.feature4_value + "\"}"));
            if (num > 5) {
              data.push(JSON.parse("{\"label\":\"" + req.body.feature5_label + "\",\"value\":\"" + req.body.feature5_value + "\"}"));
              if (num > 6) {
                data.push(JSON.parse("{\"label\":\"" + req.body.feature6_label + "\",\"value\":\"" + req.body.feature6_value + "\"}"));
                if (num > 7) {
                  data.push(JSON.parse("{\"label\":\"" + req.body.feature7_label + "\",\"value\":\"" + req.body.feature7_value + "\"}"));
                  if (num > 8) {
                    data.push(JSON.parse("{\"label\":\"" + req.body.feature8_label + "\",\"value\":\"" + req.body.feature8_value + "\"}"));
                    if (num > 9) {
                      data.push(JSON.parse("{\"label\":\"" + req.body.feature9_label + "\",\"value\":\"" + req.body.feature9_value + "\"}"));
                      if (num > 10) {
                        data.push(JSON.parse("{\"label\":\"" + req.body.feature10_label + "\",\"value\":\"" + req.body.feature10_value + "\"}"));
                        if (num > 11) {
                          data.push(JSON.parse("{\"label\":\"" + req.body.feature11_label + "\",\"value\":\"" + req.body.feature11_value + "\"}"));
                          if (num > 12) {
                            data.push(JSON.parse("{\"label\":\"" + req.body.feature12_label + "\",\"value\":\"" + req.body.feature12_value + "\"}"));
                            if (num > 13) {
                              data.push(JSON.parse("{\"label\":\"" + req.body.feature13_label + "\",\"value\":\"" + req.body.feature13_value + "\"}"));
                              if (num > 14) {
                                data.push(JSON.parse("{\"label\":\"" + req.body.feature14_label + "\",\"value\":\"" + req.body.feature14_value + "\"}"));
                                if (num > 15) {
                                  data.push(JSON.parse("{\"label\":\"" + req.body.feature15_label + "\",\"value\":\"" + req.body.feature15_value + "\"}"));
                                  if (num > 16) {
                                    data.push(JSON.parse("{\"label\":\"" + req.body.feature16_label + "\",\"value\":\"" + req.body.feature16_value + "\"}"));
                                    if (num > 17) {
                                      data.push(JSON.parse("{\"label\":\"" + req.body.feature17_label + "\",\"value\":\"" + req.body.feature17_value + "\"}"));
                                      if (num > 18) {
                                        data.push(JSON.parse("{\"label\":\"" + req.body.feature18_label + "\",\"value\":\"" + req.body.feature18_value + "\"}"));
                                        if (num > 19) {
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
  var pro = new Promise(function (resolve, reject) {
    if (req.file) {
      const readstream = gfs.createReadStream(req.file.filename);
      readstream.on('data', (chunk) => {
      array = chunk.toString('base64');
      Console.log(array)
      resolve();
      })
    } else {
      array = "";
      resolve();
    }
  })
  pro.then(() => {
    SubCategory.findOne({ name: req.body.sub_cat }, function (err, ncategory) {

      if (err) return next(err);
      var obj;
      Brand.findOne({ name: req.body.brand }, function (err, nbrand) {
        console.log( ncategory.category)
        if (array != "") {
          obj = {
            'name': req.body.title1,
            'subcategory': ncategory._id,
            'category': ncategory.category,
            'productPrice.listPrice': 0,
            'image': array,
            'brand': nbrand._id,
            'model': req.body.model,
            'warranty': req.body.warranty,
            'description': req.body.description,
            'shippingInfo': req.body.shippingInfo,
            'features': data
          }
        }else{
          obj={
            'name': req.body.title1,
            'subcategory': ncategory._id,
            'category': ncategory.category,
            'productPrice.listPrice': req.body.list_price,
            'brand': nbrand._id,
            'model': req.body.model,
            'warranty': req.body.warranty,
            'description': req.body.description,
            'shippingInfo': req.body.shippingInfo,
            'features': data
          }
        }
          Product.findOneAndUpdate({ _id: mongo.ObjectID(req.params.pid) },
            {
              $set: obj

            }, { upsert: true },
            function (err, docs) {
              if (err) {
                res.send(err);
              }
            })
        
      })
    })
  })
  pro.then(() => {
    if (req.file) {
      gfs.remove({ filename: req.file.filename }, (err) => {
        if (err) console.log(err)
      })
    }
  })

});



// //saves product details
// router.post("/regiSave",upload.single("imagePath"), (req, res) => {

//   var selected_brand=req.body.brand;
//   var selected_category= req.body.catt;

//   if(req.body.catt != "" && selected_brand != ""){

//   var selected_subCategory=req.body.sub;

//   var obj=[
//     {category:selected_category},
//     {brand:selected_brand}
//   ] ;
//   var num = parseInt(req.body.num, 10);
//   var data = [];
//   // getting previously added feature and corresponding values
//   if (num > 0) {
//     if(req.body.feature0_value === ""){}else{
//       data.push(JSON.parse("{\"label\":\"" + req.body.feature0_label + "\",\"value\":\"" + req.body.feature0_value + "\"}"));
//     }
//     if (num > 1) {
//       if(req.body.feature1_value === ""){}else{
//         data.push(JSON.parse("{\"label\":\"" + req.body.feature1_label + "\",\"value\":\"" + req.body.feature1_value + "\"}"));
//       }
//       if (num > 2) {
//         if(req.body.feature2_value === ""){}else{
//           data.push(JSON.parse("{\"label\":\"" + req.body.feature2_label + "\",\"value\":\"" + req.body.feature2_value + "\"}"));
//         }
//         if (num > 3) {
//           if(req.body.feature3_value === ""){}else{
//             data.push(JSON.parse("{\"label\":\"" + req.body.feature3_label + "\",\"value\":\"" + req.body.feature3_value + "\"}"));
//           }
//           if (num > 4) {
//             if(req.body.feature4_value === ""){}else{
//               data.push(JSON.parse("{\"label\":\"" + req.body.feature4_label + "\",\"value\":\"" + req.body.feature4_value + "\"}"));
//             }
//             if (num > 5) {
//               if(req.body.feature5_value === ""){}else{
//                 data.push(JSON.parse("{\"label\":\"" + req.body.feature5_label + "\",\"value\":\"" + req.body.feature5_value + "\"}"));
//               }
//               if (num > 6) {
//                 if(req.body.feature6_value === ""){}else{
//                   data.push(JSON.parse("{\"label\":\"" + req.body.feature6_label + "\",\"value\":\"" + req.body.feature6_value + "\"}"));
//                 }
//                 if (num > 7) {
//                   if(req.body.feature7_value === ""){}else{
//                     data.push(JSON.parse("{\"label\":\"" + req.body.feature7_label + "\",\"value\":\"" + req.body.feature7_value + "\"}"));
//                   }
//                   if (num > 8) {
//                     if(req.body.feature8_value === ""){}else{
//                       data.push(JSON.parse("{\"label\":\"" + req.body.feature8_label + "\",\"value\":\"" + req.body.feature8_value + "\"}"));
//                     }
//                     if (num > 9) {
//                       if(req.body.feature9_value === ""){}else{
//                         data.push(JSON.parse("{\"label\":\"" + req.body.feature9_label + "\",\"value\":\"" + req.body.feature9_value + "\"}"));
//                       }
//                       if (num > 10) {
//                         if(req.body.feature10_value === ""){}else{
//                           data.push(JSON.parse("{\"label\":\"" + req.body.feature10_label + "\",\"value\":\"" + req.body.feature10_value + "\"}"));
//                         }
                        
//                         if (num > 11) {
//                           if(req.body.feature11_value === ""){}else{
//                             data.push(JSON.parse("{\"label\":\"" + req.body.feature11_label + "\",\"value\":\"" + req.body.feature11_value + "\"}"));
//                           }
//                           if (num > 12) {
//                             if(req.body.feature12_value === ""){}else{
//                               data.push(JSON.parse("{\"label\":\"" + req.body.feature12_label + "\",\"value\":\"" + req.body.feature12_value + "\"}"));
//                             }
//                             if (num > 13) {
//                               if(req.body.feature13_value === ""){}else{
//                                 data.push(JSON.parse("{\"label\":\"" + req.body.feature13_label + "\",\"value\":\"" + req.body.feature13_value + "\"}"));
//                               }
//                               if (num > 14) {
//                                 if(req.body.feature14_value === ""){}else{
//                                   data.push(JSON.parse("{\"label\":\"" + req.body.feature14_label + "\",\"value\":\"" + req.body.feature14_value + "\"}"));
//                                 }
//                                 if (num > 15) {
//                                   if(req.body.feature15_value === ""){}else{
//                                     data.push(JSON.parse("{\"label\":\"" + req.body.feature15_label + "\",\"value\":\"" + req.body.feature15_value + "\"}"));
//                                   }
//                                   if (num > 16) {
//                                     if(req.body.feature16_value === ""){}else{
//                                       data.push(JSON.parse("{\"label\":\"" + req.body.feature16_label + "\",\"value\":\"" + req.body.feature16_value + "\"}"));
//                                     }
//                                     if (num > 17) {
//                                       if(req.body.feature17_value === ""){}else{
//                                         data.push(JSON.parse("{\"label\":\"" + req.body.feature17_label + "\",\"value\":\"" + req.body.feature17_value + "\"}"));
//                                       }
//                                       if (num > 18) {
//                                         if(req.body.feature18_value === ""){}else{
//                                           data.push(JSON.parse("{\"label\":\"" + req.body.feature18_label + "\",\"value\":\"" + req.body.feature18_value + "\"}"));
//                                         }
//                                         if (num > 19) {
//                                           if(req.body.feature19_value === ""){}else{
//                                             data.push(JSON.parse("{\"label\":\"" + req.body.feature19_label + "\",\"value\":\"" + req.body.feature19_value + "\"}"));
//                                           }
//                                         }
//                                       }
//                                     }
//                                   }
//                                 }
//                               }
//                             }
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
 
//  var pro = new Promise(function (resolve, reject) {
//     const readstream = gfs.createReadStream(req.file.filename);
//     readstream.on('data', (chunk) => {
//       arr = chunk.toString('base64');
//       resolve();
//     })
//   })
//   pro.then(()=>{
//     if( selected_subCategory != "null"){
//       obj.push({subcategory: selected_subCategory})
//     } 
//   })
//   pro.then(()=>{
//     // getting newly added features and updating to feature collection and the feature 
//     // and value is being stored in data[] whic will be added in product collection
//     if(req.body.new_feat > 0){
//       data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_1 + "\",\"value\":\"" + req.body.v1 + "\"}"));
//       Feature.update({$and:obj},{
//         $addToSet:{
//           "feature":req.body.new_feat_1
//         }},{ upsert: true },function(err, docs){
//           if(err){ console.log(err)}
//           if(req.body.new_feat > 1){
//             data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_2 + "\",\"value\":\"" + req.body.v2 + "\"}"));
//             Feature.update({$and:obj},{
//               $addToSet:{
//                 "feature":req.body.new_feat_2
//               }},{ upsert: true },function(err, docs){
//                 if(err){ console.log(err)}
//                 if(req.body.new_feat > 2){
//                   data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_3 + "\",\"value\":\"" + req.body.v3 + "\"}"));
//                   Feature.update({$and:obj},{
//                     $addToSet:{
//                       "feature":req.body.new_feat_3
//                     }},{ upsert: true },function(err, docs){
//                       if(err){ console.log(err)}
//                       if(req.body.new_feat > 3){
//                         data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_4 + "\",\"value\":\"" + req.body.v4 + "\"}"));
//                         Feature.update({$and:obj},{
//                           $addToSet:{
//                             "feature":req.body.new_feat_4
//                           }},{ upsert: true },function(err, docs){
//                             if(err){ console.log(err)}
//                             if(req.body.new_feat > 4){
//                               data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_5 + "\",\"value\":\"" + req.body.v5 + "\"}"));
//                               Feature.update({$and:obj},{
//                                 $addToSet:{
//                                   "feature":req.body.new_feat_5
//                                 }},{ upsert: true },function(err, docs){
//                                   if(err){ console.log(err)}
//                                   if(req.body.new_feat > 5){
//                                     data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_6 + "\",\"value\":\"" + req.body.v6 + "\"}"));
//                                     Feature.update({$and:obj},{
//                                       $addToSet:{
//                                         "feature":req.body.new_feat_6
//                                       }},{ upsert: true },function(err, docs){
//                                         if(err){ console.log(err)}
//                                         if(req.body.new_feat > 6){
//                                           data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_7 + "\",\"value\":\"" + req.body.v7 + "\"}"));
//                                           Feature.update({$and:obj},{
//                                             $addToSet:{
//                                               "feature":req.body.new_feat_7
//                                             }},{ upsert: true },function(err, docs){
//                                               if(err){ console.log(err)}
//                                               if(req.body.new_feat > 7){
//                                                 data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_8 + "\",\"value\":\"" + req.body.v8 + "\"}"));
//                                                 Feature.update({$and:obj},{
//                                                   $addToSet:{
//                                                     "feature":req.body.new_feat_8
//                                                   }},{ upsert: true },function(err, docs){
//                                                     if(err){ console.log(err)}
//                                                     if(req.body.new_feat > 8){
//                                                       data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_9 + "\",\"value\":\"" + req.body.v9 + "\"}"));
//                                                       Feature.update({$and:obj},{
//                                                         $addToSet:{
//                                                           "feature":req.body.new_feat_9
//                                                         }},{ upsert: true },function(err, docs){
//                                                           if(err){ console.log(err)}
//                                                           if(req.body.new_feat > 9){
//                                                             data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_10 + "\",\"value\":\"" + req.body.v10 + "\"}"));
//                                                             Feature.update({$and:obj},{
//                                                               $addToSet:{
//                                                                 "feature":req.body.new_feat_10
//                                                               }},{ upsert: true },function(err, docs){
//                                                                 if(err){ console.log(err)}
                                                               
//                                                               }
//                                                             ) 
//                                                           }
//                                                         }
//                                                       ) 
//                                                     }
//                                                   }
//                                                 ) 
//                                               }
//                                             }
//                                           ) 
//                                         }
//                                       }
//                                     ) 
//                                   }
//                                 }
//                               ) 
//                             }
//                           }
//                         ) 
//                       }
//                     }
//                   ) 
//                 }
//               }
//             ) 
//           }
//         }
//       ) 
//     }
//   })
//   pro.then(() => {
//     var newProduct = {
//       name: req.body.title,
//       category: selected_category,
//       image: arr,
//       admin: req.user.id,
//       brand: selected_brand,
//       model: req.body.model,
//       warranty: req.body.warranty,
//       description: req.body.description,
//       shippingInfo: req.body.shippingInfo,
//       features: data,
//       categoryName: req.body.cattN,
//       subcategoryName:  req.body.subN,
//       brandName: req.body.brandN,
//     };
//     if( selected_subCategory != "null"){
//       newProduct.subcategory= selected_subCategory
//     }
//     console.log(newProduct)
//         new Product(newProduct).save().then(product => {

//           Cat.update(
//           { _id: selected_category },
//           { $addToSet: { brands: selected_brand} },
//           { upsert: true },
//           function(err, docs) {
//             if (err) {
//             }
//             if (selected_subCategory != "null") {
//               SubCategory.update(
//                 { _id: selected_subCategory },
//                 { $addToSet: { brands: selected_brand}, category: selected_category  },
//                 { upsert: true },
//                 function(err, docs) {
//                   if (err) {
//                     res.send(err);
//                   }
                 
//                 }
//               );
//             } 
//           }
//         );
          
//         });
//   })
//   pro.then(() => {
//     gfs.remove({ filename: req.file.filename }, (err) => {
//       if (err) console.log(err)
//       req.flash("success_msg", "Product added.");
//       res.redirect("/category/Entry");
//     })
//   })
// }else{
//   req.flash("error_msg", "please submit the form with category,sub category and brand before filling product info!");
//   res.redirect("/category/Entry");
// }
// });


module.exports = router;
