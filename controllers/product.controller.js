//Imports
var mongo = require("mongodb");
const Product = require("../models/Product");
const SubCategory = require("../models/subCategory.model");

exports.newLot= (req, res, next) => {
  find({_id: req.params.id}, function(rs){
    res.render("addNewLot", {product:rs[0]});
  })
  
};

exports.saveSerial= (req, res, next) => {
  console.log(req.body.serial)
  
  var ob={
    color: req.body.color,
    serial: req.body.serial
  }
  Product.update({_id: req.params.id},{
    $addToSet:{
      "serial":ob
    }},{ upsert: true },function(err, docs){
      if(err){ console.log("dsfajhh")}
      console.log(req.body.serial)
      res.render("products/reg");
    }
  )
 
};

exports.getLiveStockEditpage= (req, res, next) => {
  res.render("updateLiveStock");
};

exports.showProductRegistrationFieldspage= (req, res, next) => {
  res.render("products/reg");
};

exports.addLotPage= (req, res, next) => {
  res.render("addNewLot");
};

// returns allproduct page
exports.getAllProducts = (req, res, next) => {
    var resultArray = [];
    Product.find()
      .sort({ "created": 1 })
      .populate("subcategory")
      .exec(function(err, docs) {
        if (err) {
          res.send(err);
        } else {
          for (var i = docs.length - 1; i > -1; i -= 1) {
            resultArray.push(docs[i]);
          }
        }

        res.render("products/allProductView", {
          title: "All Product",
          products: resultArray
        });
      });
};

// single product view
exports.singleProduct = (req, res) => {
  var resultArray = [];
  Product.findById(mongo.ObjectID(req.params.id))
    .populate("brand")
    .populate("owner")
    .populate({
      path: "subcategory",
      populate: { path: "category" }
    })
    .exec(function(err, product) {
      resultArray = product;
      var obj = resultArray.features;
      console.log(resultArray);
      res.render("single", {
        title: "Single",
        product: resultArray,
        features: obj
      });
    });
};

// returns Edit page from product info
exports.getEditpage = (req, res, next) => {
  Product.find({ _id: mongo.ObjectID(req.params.id) })
    .populate("brand")
    .populate({
      path: "subcategory",
      populate: { path: "category" }
    })
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.render("products/update", {
          title: "Update Product",
          product: docs[0],
          num_feature: docs[0].subcategory.features.length
        });
      }
    });
};


// update function
function changeStatus(req, res, object) {
  Product.findOneAndUpdate(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: object
    },
    { upsert: true },
    function(err, docs) {
      if (err) {
        res.send(err);
      }
    }
  );
}

// returns Remove product sale
exports.removeFromSale = (req, res, next) => {

  var obj = { 

    onSale: false,
    'productPrice.salePrice': null
  };
  changeStatus(req, res, obj);
  res.redirect("/products/view");

};

// returns product offline stock
exports.makeNotActive = (req, res, next) => {

  var obj = { isActive: false, onSale:false, 'productPrice.salePrice': null };
  changeStatus(req, res, obj);
  res.redirect("/products/view");

};

// adds to the sale list
exports.makeOnSale = (req, res, next) => {

  var obj = { onSale: true };
  changeStatus(req, res, obj);
  res.redirect("/products/Online/" + req.params.cid);

};

// makes product online
exports.makeActive = (req, res, next) => {

  var obj = { isActive: true };
  changeStatus(req, res, obj);
  res.redirect("/products/view");

};

// returns edit product stock
exports.getEditStock = (req, res, next) => {

  Product.findOneAndUpdate(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: {
        "quantity.stock": req.body.stock,
        "quantity.storeLive": req.body.storelive,
        "quantity.stock_last_update": new Date(),
        "quantity.userID": req.user.id
      }
    },
    { upsert: true },
    function(err, docs) {

      if (err) {

        res.send(err);

      } else {

        res.redirect("/products/stock");

      }

    }

  );

};

// returns Edit stock page
exports.getEditStockPage = (req, res, next) => {

  Product.find({ _id: mongo.ObjectID(req.params.id) }, function(err, docs) {

    if (err) {
      res.send(err);
    }
    res.render("editStockInfo", {
      title: "Update Stock Info",
      product: docs[0]
    });

  });

};

// returns all product with stock info page
exports.getAllProductStock = (req, res, next) => {

  var resultArray = [];
  Product.find()
  .sort({ "quantity.stock": -1 })
  .populate("subcategory")
  .populate("quantity.userID")
  .exec(function(err, docs) {
    if (err) {
      res.send(err);
    } else {
      for (var i = docs.length - 1; i > -1; i -= 1) {
        resultArray.push(docs[i]);
      }
    }
    res.render("stock", {
      title: "Stock",
      products: resultArray
    });
  });

};

//find fuction
function find(obj, cb) {
  var resultArray = [];
  Product.find(obj)
    .populate("subcategory")
    .exec(function(err, docs) {
      
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArray.push(docs[i]);
        }
     
      cb(resultArray);
    });
}

exports.getProduct = (req, res, next)=>{
  find({subcategory: req.params.sub_cat},function(rs){
    console.log(rs);
    res.render("addNewLot", {product:rs});
  })
}

// returns setDiscount page
exports.addDiscountpage = (req, res, next)=>{
  find({_id: req.params.id},function(rs){
    res.render("setDiscount", {id: req.params.id, products:rs[0]});
  })
}

// returns setDiscount to the selected product
exports.addDiscount = (req, res, next)=>{
  
  find({_id: req.params.id}, function(rs){

    var listPrice = rs[0].productPrice.listPrice;
    var with_discount = listPrice-((req.body.discount/100)*listPrice);
    console.log(with_discount)
    if(with_discount <= rs[0].productPrice.wholeSalePrice ){

      req.flash('error_msg', "Discounted price is less than the wholesale price!");
      var obj = {'productPrice.salePrice': Number((with_discount).toFixed(0)), onSale:true};
      changeStatus(req, res, obj);
      res.redirect('/products/view');

    }else{

      var obj = {'productPrice.salePrice': Number((with_discount).toFixed(0)), onSale:true };
      changeStatus(req, res, obj);
      res.redirect('/products/view');
      
    }
  })

}

// returns Offline Product page
exports.getOfflineProductsPage = (req, res, next) => {
  var obj = { isActive: false };
  find(obj, function(rs) {
    res.render("products/allProductView", {
      title: "Offline Products",
      products: rs
    });
  });
  
};

// returns Online Product page
exports.getOnlineProductsPage = (req, res, next) => {
  var obj = { isActive: true};
  find(obj, function(rs) {
    res.render("products/allProductView", {
      title: "Online Products",
      products: rs
    });
  });
};

// returns Sale Products Page
exports.getSaleProductsPage = (req, res, next) => {
  var obj = { onSale: true };
  find(obj, function(rs) {
    res.render("products/allProductView", {
      title: "Sale Product",
      products: rs
    });
  });
};

// delete product
exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: mongo.ObjectID(req.params.id) }, function(err,bear) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/products/view");
    }
  });
};

// shows the number of fields user wants
exports.showProductRegistrationFields = (req, res, next) => {
  SubCategory.find({ name: req.params.cat },function(err, docs1) {
    res.render("products/reg", {
      category: req.params.cat,
      features: docs1[0].features,
      num_feature: docs1[0].features.length,
      title: "Registration"
    });
  });
};

