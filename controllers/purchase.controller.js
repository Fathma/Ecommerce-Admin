const LP = require("../models/localPurchase.model");
const Product = require("../models/Product");

// get supplier registration page
exports.LocalPurchasePage = (req, res, next) => {
  res.render("purchase/localPurchase");
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
  var form_product = req.body.model1
  var contact= (req.body.contt).split(",")
  var invoice_number= req.body.number;
  var total= Number(req.body.quantity) * Number(req.body.PP)

  // fetching sub, cat, brand and product
  var cat = (req.body.cattN).split(",")
  var sub = (req.body.subNn).split(",")
  var brand = (req.body.brandN).split(",")
  var pro = await Product.findOne({ model: form_product });
  var lp = await LP.findOne({ number: invoice_number });

  // if the fetched product is null insert the product
  if (pro === null) {
    var pro_obj = {
      model: form_product,
      category: cat[0],
      brand: brand[0]
    };
    if (req.body.serial_availablity === "on") {
      pro_obj.serial_availablity= true
    }else{
      pro_obj.serial_availablity= false
    }
    if (sub != null) {
      pro_obj.subcategory = sub[0]; 
      pro_obj.productName= cat[1]+"-"+sub[1]+"-"+brand[1]+"-"+form_product;
      pro_obj.pid = cat[1].slice(0,3)+ sub[1].slice(0,3)+ brand[1].slice(0,3)+ form_product
    }
    else{
      pro_obj.productName= cat[1]+"-"+brand[1]+"-"+form_product
      pro_obj.pid = cat[1].slice(0,3)+ brand[1].slice(0,3)+ form_product
    }
    pro = await new Product(pro_obj).save();
  }

  var product = {
    product: pro._id,
    quantity: req.body.quantity,
    purchasePrice: req.body.PP,
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
    res.redirect("/purchase/localPurchase/" + invoice_number);
  } else {
    await LP.update({ number: invoice_number },
      { 
        $addToSet: { products: product },
        $inc: { subTotal: +total }
      },
      { upsert: true });
    res.redirect("/purchase/localPurchase/" + invoice_number);
  }
};
