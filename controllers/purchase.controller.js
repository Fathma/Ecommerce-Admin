const LP = require('../models/localPurchase.model');
const Product = require('../models/Product');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

// get supplier registration page
exports.LocalPurchasePage = (req, res) => res.render('purchase/localPurchase');

// get supplier registration page
exports.getLPList = async (req, res) => {
  var lp = await LP.find().populate('supplier');
  res.render('purchase/allPurchase', { lp })
};

// fetching products of a specific local purchase 
exports.getProducts = (req, res) => {

  LP.findOne({ _id: req.params.invc })
    .populate('products.product')
    .populate({
      path: 'products.product',
      populate: { path: 'category' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'brand' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'subcategory' },
    })
    .populate('supplier')
    .exec((err, doc) => {
      res.send(doc);
    });
};

// get supplier registration page
exports.LocalPurchaseLPPage = (req, res, next) => {

  LP.findOne({ number: req.params.invc })
    .populate('products.product')
    .populate({
      path: 'products.product',
      populate: { path: 'category' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'brand' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'subcategory' }
    })
    .populate('supplier')
    .exec((err, doc) => {

      var count = 1;

      for (var i = 0; i < doc.products.length; i++) {
        doc.products[i].num = count;
        count++;
      }

      res.render('purchase/localPurchase', { lp: doc });
    });
};

// saves local purchase
exports.SaveLocalPurchase = async (req, res) => {
  console.log(req.body)
  const { model1, contt, number, quantity, purchasePrice, cattN, subNn, brandN, serial_availablity } = req.body;
  var contact = contt.split(',')
  var total = Number(quantity) * Number(purchasePrice)
  var brand = (brandN).split(',')
  
  // fetching sub, cat, brand and product
  var cat = (cattN).split(',')
  if(subNn != '0'){
    var sub = (subNn).split(',')
    await SubCategory.updateOne({_id: sub[0]}, {$addToSet:{ brands: brand[0]} },{ upsert: true })
  }
  

  await Category.updateOne({_id: cat[0]}, {$addToSet:{ brands: brand[0]} },{ upsert: true })
  
  var pro = await Product.findOne({ model: model1 });
  var lp = await LP.findOne({ number });


  // if the fetched product is null insert the product
  if (pro === null) {
    var pro_obj = {
      model: model1,
      category: cat[0],
      brand: brand[0]
    };
    if (serial_availablity === 'on') {
      pro_obj.serial_availablity = true
    }else{
      pro_obj.serial_availablity = false
    }
    if (subNn != '0') {
      pro_obj.subcategory = sub[0]; 
      pro_obj.productName = `${cat[1]}-${sub[1]}-${brand[1]}-${model1}`;
      pro_obj.pid = cat[1].slice(0,3)+ sub[1].slice(0,3)+ brand[1].slice(0,3)+ model1
    }
    else{
      pro_obj.productName = `${cat[1]}-${brand[1]}-${model1}`
      pro_obj.pid = cat[1].slice(0,3)+ brand[1].slice(0,3)+ model1
    }
    pro = await new Product(pro_obj).save();
  }

  var product = { product: pro._id, quantity, purchasePrice, total }

  // if localpurchase doesn't exist then insert 
  // else insert newly added product and update subtotal 
  if (lp === null) {
    var obj = req.body;
    obj.contactPerson= contact[0]
    obj.mobile= contact[1]
    obj.products= [ product ], 
    obj.subTotal= total
    
    await new LP(obj).save();
  } else {
    await LP.update({ number },
      { 
        $addToSet: { products: product },
        $inc: { subTotal: +total }
      }, { upsert: true });
  }
  res.redirect("/purchase/localPurchase/" + number);
};
