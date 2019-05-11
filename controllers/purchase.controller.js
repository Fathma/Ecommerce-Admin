const LP = require("../models/localPurchase.model");
const Product = require("../models/Product");

// get supplier registration page
exports.LocalPurchasePage = (req, res, next) => {
  res.render("purchase/localPurchase");
};

// get supplier registration page
exports.getLPList = async (req, res, next) => {
  
  var lp = await LP.find().populate("supplier");
  console.log(lp)
  res.render("purchase/allPurchase", { lp })
};

// fetching products of a specific local purchase 
exports.getProducts = (req, res, next) => {
  LP.findOne({ _id: req.params.invc })
    .populate("products.product")
    .populate({
      path: "products.product",
      populate: { path: "category" }
    })
    .populate({
      path: "products.product",
      populate: { path: "brand" }
    })
    .populate({
      path: "products.product",
      populate: { path: "subcategory" },
    })
    .populate("supplier")
    .exec((err, doc) => {
      res.send(doc);
    });
};

// get supplier registration page
exports.LocalPurchaseLPPage = (req, res, next) => {
  LP.findOne({ number: req.params.invc })
    .populate("products.product")
    .populate({
      path: "products.product",
      populate: { path: "category" }
    })
    .populate({
      path: "products.product",
      populate: { path: "brand" }
    })
    .populate({
      path: "products.product",
      populate: { path: "subcategory" }
    })
    .populate("supplier")
    .exec((err, doc) => {
      var count = 1;
      for (var i = 0; i < doc.products.length; i++) {
        doc.products[i].num = count;
        count++;
      }
      res.render("purchase/localPurchase", { lp: doc });
    });
};

// saves local purchase
exports.SaveLocalPurchase = async (req, res) => {
  const {model1,contt, number, quantity, PP, cattN, subNn, brandN, serial_availablity } = req.body;
  var contact= contt.split(",")
  var total= Number(quantity) * Number(PP)

  // fetching sub, cat, brand and product
  var cat = (cattN).split(",")
  var sub = (subNn).split(",")
  var brand = (brandN).split(",")
  var pro = await Product.findOne({ model: model1 });
  var lp = await LP.findOne({ number });

  // if the fetched product is null insert the product
  if (pro === null) {
    var pro_obj = {
      model: model1,
      category: cat[0],
      brand: brand[0]
    };
    if (serial_availablity === "on") {
      pro_obj.serial_availablity= true
    }else{
      pro_obj.serial_availablity= false
    }
    if (sub != "0") {
      pro_obj.subcategory = sub[0]; 
      pro_obj.productName= cat[1]+"-"+sub[1]+"-"+brand[1]+"-"+ model1;
      pro_obj.pid = cat[1].slice(0,3)+ sub[1].slice(0,3)+ brand[1].slice(0,3)+ model1
    }
    else{
      pro_obj.productName= cat[1]+"-"+brand[1]+"-"+ model1
      pro_obj.pid = cat[1].slice(0,3)+ brand[1].slice(0,3)+ model1
    }
    pro = await new Product(pro_obj).save();
  }

  var product = {
    product: pro._id,
    quantity: quantity,
    purchasePrice: PP,
    total: total
  }

  // if localpurchase doesn't exist then insert 
  // else insert newly added product and update subtotal 
  if (lp === null) {
    var obj = req.body;
    obj.contactPerson= contact[0]
    obj.mobile= contact[1]
    obj.products= [ product ], 
    obj.subTotal= total
    
    
    await new LP(obj).save();
    res.redirect("/purchase/localPurchase/" + number);
  } else {
    await LP.update({ number: number },
      { 
        $addToSet: { products: product },
        $inc: { subTotal: +total }
      },
      { upsert: true });
    res.redirect("/purchase/localPurchase/" + number);
  }
};
