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
var Brand = require("../models/brand.model")

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

router.get("/view", ensureAuthenticated, product_controller.getAllProducts);
router.get("/delete/:id", ensureAuthenticated, product_controller.deleteProduct);
router.get("/showfields/:cat", ensureAuthenticated, product_controller.showProductRegistrationFields);
router.get("/showfields", ensureAuthenticated, product_controller.showProductRegistrationFieldspage);
router.get("/singleProduct/:id", product_controller.singleProduct);
router.get("/Edit/:category/:id", product_controller.getEditpage);
router.get("/stock", product_controller.getAllProductStock);
router.get("/stockEditPage/:id", product_controller.getEditStockPage);
router.get("/stockEditPage", product_controller.addLotPage);
router.post("/stockEdit/:id", product_controller.getEditStock);
router.get("/Online", product_controller.getOnlineProductsPage);
router.get("/offline", product_controller.getOfflineProductsPage);
router.get("/active/:id/:cid", product_controller.makeActive);
router.get("/unactive/:id", product_controller.makeNotActive);
router.get("/Sale", product_controller.getSaleProductsPage);
router.get("/liveStockEdit/:id", product_controller.getLiveStockEditpage);
router.get("/RemoveFromSale/:id/:cid", product_controller.removeFromSale);
router.get("/makeSale/:id/:cid", product_controller.makeOnSale);
router.get("/addDiscount/:id/:cid", product_controller.addDiscountpage);
router.get("/newLot", product_controller.newLot);
router.get("/getProduct/:sub_cat", product_controller.getProduct);
router.post("/Discount/:id", product_controller.addDiscount);
router.post("/saveSerial/:id", product_controller.saveSerial);

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
            'color': req.body.color,
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
            'color': req.body.color,
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
//saves product details
router.post("/regiSave/:category/:num", upload.single("imagePath"), (req, res) => {
  
  var num = parseInt(req.params.num, 10);
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
    const readstream = gfs.createReadStream(req.file.filename);
    readstream.on('data', (chunk) => {
      arr = chunk.toString('base64');
      resolve();
    })
  })
  pro.then(() => {

    SubCategory.findOne({ name: req.params.category }, function (err, ncategory) {

      if (err) return next(err);
      Brand.findOne({ name: req.body.brand }, function (err, nbrand) {

        newProduct = {
          name: req.body.title,
          subcategory: ncategory._id,
          category: ncategory.category,
          productPrice: {
            listPrice: 0,
            salePrice: null,
            wholeSalePrice: 0
          },
          serial:[],
          image: arr,
          owner: req.user.id,
          brand: nbrand._id,
          model: req.body.model,
          color: req.body.color,
          warranty: req.body.warranty,
          description: req.body.description,
          shippingInfo: req.body.shippingInfo,
          isActive: false,
          onSale: false,
          features: data,
          quantity: {
            stock: 0,
            storeLive: 0
          },
          pinned: "",
          home: ""
        };
        new Product(newProduct).save().then(product => {
          req.flash("success_msg", "Product added.");
          res.redirect("/products/view");
        });
      })
    })

  })
  pro.then(() => {
    gfs.remove({ filename: req.file.filename }, (err) => {
      if (err) console.log(err)
    })
  })
});


module.exports = router;
