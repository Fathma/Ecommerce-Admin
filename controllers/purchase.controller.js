const Supplier = require("../models/supplier.model");
const LP = require("../models/localPurchase.model");
const Product = require("../models/Product");
const Brand = require("../models/brand.model");
const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
var randomstring = require("randomstring");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const multer = require("multer");

const mongoo = "mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db";

const conn = mongoose.createConnection(mongoo);
let gfs;
conn.once("open", function() {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});
var filename;
// create storage engine
const storage = new GridFsStorage({
  url: mongoo,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "fs"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// get supplier registration page
exports.supplierRegistrationPage = (req, res, next) => {
  var date = new Date();
  res.render("purchase/supplierReg", { date: date });
};

// get supplier registration page
exports.LocalPurchasePage = (req, res, next) => {
  res.render("purchase/localPurchase");
};
// get supplier registration page
exports.LocalPurchaseLPPage = (req, res, next) => {
  LP.findOne({ number: req.params.invc })
    .populate("products.product")
    .populate("supplier")
    .exec((err, docs) => {
      res.render("purchase/localPurchase", { lp: docs });
    });
};

exports.getContactPerson =async (req, res)=>{
  var sup = await Supplier.findOne({_id: req.params.sup})
  res.send(sup)
}

// save supplier info
exports.supplierSave = (req, res, next) => {
  var obj = req.body.obj;
  var id = randomstring.generate(5);
  var name = obj.cname.split("");

  id += name[0];
  id += name[1];
  id += name[2];

  obj.supplier_id = id;
  new Supplier(obj).save().then(supplier => {
    req.flash("success_msg", "Registration successful");
    res.render("purchase/supplierReg");
  });
};

// get all registered suppliers
exports.supplierList = (req, res) => {
  Supplier.find((err, docs) => {
    res.render("purchase/supplierList", { supplier: docs });
  });
};

// get all registered suppliers
exports.supplierEditPage = (req, res) => {
  Supplier.findOne({ _id: req.params.id }, (err, docs) => {
    if (docs.address != null && docs.contactPerson != null) {
      console.log(docs.contactPerson.length);
      res.render("purchase/supplierEdit", {
        supplier: docs,
        total_address: docs.address.length,
        total_contacts: docs.contactPerson.length
      });
    }
  });
};

// Edit Supplier info
exports.supplierEdit = (req, res) => {
  Supplier.updateOne(
    { _id: req.params.id },
    { $set: req.body.obj },
    { upsert: true },
    (err, docs) => {
      if (err) res.send(err);
      res.send({});
    }
  );
};

// Edit Supplier info
exports.supplierDelete = (req, res) => {
  Supplier.deleteOne({ _id: req.params.id }, (err, docs) => {
    if (err) res.send(err);
    else res.redirect("/purchase/SupplierList");
  });
};

exports.SaveLocalPurchase = async (req, res) => {
  var form_avl = false;
  if (req.body.serial_availablity === "on") {
    form_avl = true;
  }
  var form_cat = req.body.cattN;
  var form_brand = req.body.brandN;
  var form_sub = req.body.subNn;
  var form_product = req.body.model1;
  var form_supplier = req.body.supplier;
  var contact= (req.body.contt).split(",")

  var sup = await Supplier.findOne({ _id: form_supplier });
  var brand = await Brand.findOne({ name: form_brand });
  var cat = await Category.findOne({ name: form_cat });
  var sub = await SubCategory.findOne({ name: form_sub });
  var pro = await Product.findOne({ model: form_product });

  if (pro === null) {
    var pro_obj = {
      model: form_product,
      serial_availablity: form_avl,
      category: cat._id,
      brand: brand._id,
      categoryName: cat.name,
      brandName: brand.name
    };
    if (sub != null) {
      (pro_obj.subcategory = sub._id), (pro_obj.subcategoryName = sub.name);
    }
    pro = await new Product(pro_obj).save();
  }
  var lp = await LP.findOne({ number: req.body.LP });
  if (lp === null) {
    console.log(sup.contactPerson.contactName)
    var obj = {
      number: req.body.LP,
      supplier: sup._id,
      contactPerson: contact[0],
      mobile: contact[1],         
      products: [
        {
          product: pro._id,
          quantity: req.body.quantity,
          purchasePrice: req.body.PP
        }
      ]
    };

    await new LP(obj).save();
    res.redirect("/purchase/localPurchase/" + req.body.LP);
  } else {
    var product = {
      product: pro._id,
      quantity: req.body.quantity,
      purchasePrice: req.body.PP
    };
    await LP.update(
      { number: req.body.LP },
      { $addToSet: { products: product } },
      { upsert: true }
    );
    res.redirect("/purchase/localPurchase/" + req.body.LP);
  }
};
