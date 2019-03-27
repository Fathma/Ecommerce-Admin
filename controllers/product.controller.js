//Imports
var mongo = require("mongodb");
const Product = require("../models/Product");
const SubCategory = require("../models/subCategory.model");
const Feature = require("../models/features.model");
const Inventory = require("../models/inventory.model");
const Category = require("../models/category.model");
const allFuctions = require("../functions/allFuctions");
const multer = require("multer");
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

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

// get low quantity for notification
exports.lowLiveQuantity=async (req, res, next) => {
  var condition = {"live.quantity":{$lt:3}, isActive: true};
  let docs = await allFuctions.get_live(condition);
  var count=0;
  if(docs.length != 0){ count++; }
  res.json({quantity: docs.length, count:count})
};

// view total stock information
exports.viewStock = (req, res) =>{
  console.log("jfsdhfjhdsjfh");
  var arr=[];
  Inventory.findOne({_id: req.params.id}).populate("product_id").exec((err, docs)=>{
    
    
    docs.original_serial.map((sl)=>{
      var count = 0;
      var id="";
      id+=(docs.product_id.categoryName.split(""))[0]+"0";
      if(docs.product_id.subcategoryName === ""){
        id+="1"+count;
      }else{
        id+=(docs.product_id.subcategoryName.split(""))[0]+"1"+count;
      }
      
      id+=(docs.product_id.brandName.split(""))[0]+"2";
      id+= sl;
      var obj = {
        s_id : id,
        sl:sl,
        p_name:docs.product_id.model,
        pp: docs.purchasePrice
      }
      if(docs.serial.includes(sl.toString())){
        obj.status = "In Stock"
      }else{
        docs.product_id.live.serial.map((srl)=>{
          if(srl.serial.toString() === sl.toString()){
            obj.status = "In Live";
          }else{
            obj.status = "Sold";
          }
        })
      }
      arr.push(obj);
      count++;

    })
    docs.arr=arr;
    res.render("viewStock", {lot:docs}) 
  })
}

// get low quantity details
exports.lowLiveQuantityDetails= (req, res, next) => {
  Inventory.find().populate({path:"product_id", match:{"live.quantity":{$lt:3}}}).populate("admin").exec((err, rs)=>{ 
    var data = [];
    rs.map((item)=>{
      if(item.product_id != null){ data.push(item); }
    })
    allFuctions.live_wise_inventory(data,(docs)=>{
      allFuctions.get_allProduct_page(res, docs, "Inventories")
    })
  })
};

// get dashboard 
exports.showDashboard =async (req, res, next) => {
  let docs = await allFuctions.get_live({"live.quantity":{$lt:3}, isActive: true});
  res.render("dashboard",{lowlive:docs.length, data: docs});
};

// get Registration page
exports.showProductRegistrationFieldspage= (req, res, next) => {
  res.render("products/reg");
};

// get lot without serial page
exports.saveInventoryNoSerialPage= (req, res, next) => {
  res.render("addNewLotNoSerial");
};

// get new lot page
exports.newLot= (req, res, next) => {
  allFuctions.find({_id: req.params.id}, function(rs){
    res.render("addNewLot", {product:rs[0]});
  })
};

// get live stock edit page No serial
exports.getLiveStockEditNoSerialpage = async (req, res, next) => {
  var arr=[]
  var rs = await allFuctions.get_inventory_list_new({product_id:req.params.pid},{},"product_id")

  rs.map((inventory)=>{ 
    arr.push(inventory.purchasePrice); 
  })

  await arr.sort();
  var docs = await allFuctions.get_inventory_list_new({_id:req.params.id},{},"product_id")

  res.render("updateLiveNoSerial", {
      title: "Update Live",
      inventory: docs[0],
      highest_pp: arr[arr.length-1]
    });
};

// get live stock edit page
exports.getLiveStockEditpage=async (req, res, next) => {
  var arr=[]
  var rs = await allFuctions.get_inventory_list_new({product_id:req.params.pid},{},"product_id")
 
  rs.map((inventory)=>{
    arr.push(inventory.purchasePrice);
  })
  await arr.sort();
  var docs = await allFuctions.get_inventory_list_new({_id:req.params.id},{},"product_id")

  res.render("updateLiveStock", {
      title: "Update Live",
      inventory: docs[0],
      highest_pp: arr[arr.length-1]
    });
};

// get live stock edit page
exports.RestoreLiveNoserialPage = async (req, res, next) => {
  let docs = await allFuctions.get_live({_id:req.params.id});
  res.render("liveToInventoryNoSerial", {
    title: "Restore live serial",
    live: docs[0]
  });
};

// get live stock edit page
exports.getRestoreLivepage = async (req, res, next) => {
  let docs = await allFuctions.get_live({_id:req.params.id});
  res.render("liveToInventory", {
    title: "Restore live serial",
    live: docs[0]
  });
};

// this is to get selected serials and restore them in inventory and update the remaining live quantity 
exports.getRestoreLive =async (req, res, next) => {
  var live_serials=(req.body.serial).split(",");
  var product_update_serial = []
  await Product.findOne({_id:req.params.id}, async (err, docs)=>{
    await docs.live.serial.map((obj)=>{
      live_serials.map(async (selected)=>{
        if(obj.serial === selected){
          product_update_serial.push(obj);
          await Inventory.update({_id:obj.inventory},{ $addToSet:{ serial: selected}, $inc:{"remaining": +1}},{upsert:true} )
          await Product.findOneAndUpdate({_id: req.params.id}, { $pull: { "live.serial": obj },
          $inc:{"frontQuantity": -1, "live.quantity": -1}},{upsert:true})
        }
      })
    })
  })
  res.redirect("/products/RestoreLivepage/"+req.params.id);
};

// get inventory list high to low
exports.StockHighToLow= (req, res, next) => {
  allFuctions.get_all_inventory_list({},{ "remaining": -1 }, (docs)=>{
    docs.total_stock = 0;
    docs.map((inventory)=>{
      if(inventory.product_id){
        var count=0;
        inventory.product_id.live.serial.map((serial)=>{
          if((inventory._id).toString() === (serial.inventory).toString()){
            count++;
          }
        })
        inventory.count=count;
      }
    })
    allFuctions.get_allProduct_page(res, docs)
  })
};

// get inventory list low to high
exports.StockLowToHigh= (req, res, next) => {
  allFuctions.get_all_inventory_list({},{ "remaining": 1 }, (docs)=>{
   allFuctions.live_wise_inventory(docs, (rs)=>{
     allFuctions.get_allProduct_page(res, rs, "Inventories")
   })
  })
};

exports.getSearchResult = (req, res)=>{
   var search =  new RegExp(req.body.searchData, "i")
   var data =[];
   Inventory.find( )
  .populate({
    path:"product_id",
    match: { 
      $or:[
      {"title": { $regex: search }} ,
      {"model": { $regex: search }} ,
      {"description": { $regex: search }},
      {"warranty": { $regex: search }},
      {"weight": { $regex: search }},
      {"features.value": { $regex: search }}
    ]
  }})
  .exec((err, docs)=>{
    if(docs){
      docs.map((items)=>{
        if(items.product_id != null){
          data.push(items);
        }
      })

      allFuctions.live_wise_inventory(data, (rs)=>{
      allFuctions.get_allProduct_page(res, rs, "Inventories")
      })
    }
  })
}

// returns allproduct page
exports.getAllProducts = (req, res, next) => {
  allFuctions.get_all_inventory_list({},{"product_id": 1 }, (docs)=>{
    allFuctions.live_wise_inventory(docs, (rs)=>{
      allFuctions.get_allProduct_page(res, rs, "Inventories")
    })
  })
};

// Total stock and live info of a product
exports.stockInfo = (req, res, next) => {
  Product.findOne({ _id: req.params.id },(err, docs)=>{

    docs.invtry = [];
    docs.total_stock = 0;
    docs.total = docs.live.quantity;

    Inventory.find({ product_id: req.params.id }, (err2, inv)=>{
      inv.map((inven)=>{
        docs.invtry.push(inven);
        docs.total_stock +=inven.remaining;
        docs.total += inven.remaining;
      })
console.log(docs.invtry)
      res.render("viewSerial", {product:docs})
    })
  })
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
    res.redirect("/products/viewProducts");
  });
};

// makes product online
exports.makeActive = (req, res, next) => {
  var obj = { isActive: true };
  allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
    res.redirect("/products/viewProducts");
  });
};

// // returns product Enable
// exports.makeEnable = (req, res, next) => {
//   var obj = { status: false };
//   allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
//     res.redirect("/products/view");
//   });
// };

// // makes product Disable
// exports.makeDisable = (req, res, next) => {
//   var obj = { status: true };
//   allFuctions.changeStatus({_id:req.params.id}, obj, res, (docs)=>{
//     res.redirect("/products/view");
//   });
// };

// updateing stock quantity and price of prducts with no serial
exports.stockEditNoSerial =(req, res, next) => {
  var pre_Q = parseInt(req.body.pre_all_Q);
  var quan = parseInt(req.body.quantity);
  var obj ={
    purchasePrice:req.body.purchase_price,
    remaining: req.body.quantity,
    stockQuantity :req.body.quantity
  }
  if( quan > pre_Q ){
    quantity = quan-pre_Q;
    var new_s=[]
    for( var i=0; i<quantity; i++ ){
      new_s.push((mongoose.Types.ObjectId()).toString())
    }
    
    Inventory.update({ _id: req.params.lot },{ $addToSet: { serial: { $each: new_s }, original_serial: { $each: new_s }},$set:obj },{upsert:true}, (err, docs)=>{
      if(err){
        res.send(err)
      }else{
        res.redirect("/products/stockEditNoSerialPage/"+req.params.lot+"/"+req.params.pid);
      }
    })
  }
  if( quan < pre_Q ){
    quantity = pre_Q-quan;
    var new_s=[]
    Inventory.find({ _id: req.params.lot },(eer, rs)=>{
      for(var i=0; i<quantity; i++){
        new_s.push((rs[0].serial[i]).toString());
      }
      
      Inventory.update({_id:req.params.lot},{ $pull: { serial: { $in: new_s }, original_serial: { $in: new_s }},$set:obj },{upsert:true}, (err, docs)=>{
        if(err){
          res.send(err)
        }else{
          res.redirect("/products/stockEditNoSerialPage/"+req.params.lot+"/"+req.params.pid);
        }
      })
    })
  }
}

// returns Edit stock page
exports.stockEditNoSerialPage =async (req, res, next) => {
  try {
    let docs = await allFuctions.get_inventory_list_new({ _id: req.params.lot }, {}, "product_id");
    res.render("editStockInfoNoSerial", {
      title: "Update Stock Info",
      product: docs[0]
    });
  } catch (error) {
    res.send(error)
  }
};

// returns Edit stock page
exports.getEditStockPage =async (req, res, next) => {
  let docs = await allFuctions.get_inventory_list_new({ _id: req.params.lot_id }, {}, "product_id")
  var serial_string="";
  for(var i=0; i<docs[0].serial.length; i++){
    serial_string += docs[0].serial[i];
    if(i != docs[0].serial.length -1){
      serial_string += ",";
    }
  }
  let rs = await  allFuctions.get_inventory_list_new({product_id: req.params.pid }, {}, "product_id") 
  var all_serials = "";
  rs.map((lot)=>{
    if(lot._id === req.params.lot_id){}
    else{
      for(var j=0; j< lot.original_serial.length; j++){
        all_serials += lot.original_serial[j];
        if(j != lot.original_serial.length -1){
          all_serials += ",";
        }
      }
    }
  })
  res.render("editStockInfo", {
    title: "Update Stock Info",
    product: docs[0],
    serial_string: serial_string,
    original_serial:all_serials,
  });
};

// edit Purchase Price of inventory with serial
exports.EditPP = (req, res, next)=>{
  Inventory.update({ _id: req.params.lot_id },{ $set:{ purchasePrice: req.body.PP } }, { upsert: true }, (err,rs)=>{
    if(err){
      res.send(err);
    }else{
      res.redirect("/products/stockEditPage/"+ req.params.lot_id+"/"+req.params.pid)
    }
  })
}

// Delete One serial
exports.EditDelete = (req, res, next)=>{
  Inventory.update({_id: req.params.lot_id },
    {
      $pull:{
        original_serial: req.body.pre_serial_del, 
        serial:req.body.pre_serial_del
      },
      $inc:{ remaining:-1 } 
    }, { upsert:true }, (err,rs)=>{
      if(err){
        res.send(err);
      }else{
        res.redirect("/products/stockEditPage/"+ req.params.lot_id+"/"+req.params.pid)
      }
  })
}

// replace one serial number from inventory
exports.EditReplace = (req, res, next)=>{
  if(req.body.msg_err1 === "No"){
  Inventory.update({_id: req.params.lot_id },{$addToSet:{original_serial:req.body.replace_serial, serial:req.body.replace_serial}}, 
    {upsert:true}, (err,rs)=>{
      if(err){ res.send(err); } 
      else {
        Inventory.update({_id: req.params.lot_id },{$pull:{original_serial: req.body.pre_serial, serial:req.body.pre_serial}}, 
          {upsert:true}, (err,rs)=>{
          if(err){ res.send(err); }
          else{
            res.redirect("/products/stockEditPage/"+ req.params.lot_id+"/"+req.params.pid)
          }
        })
      }
    })
  }
  else{
    req.flash("error_msg", "Given serial number already exists!");
    res.redirect("/products/stockEditPage/"+ req.params.lot_id+"/"+req.params.pid)
  }
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

// getting product models by Sub category
exports.getProductBySub_filter = (req, res, next)=>{
  Inventory.find({})
  .populate({
    path:"product_id",
    match:{"subcategory": req.params.sub_cat}
  })
  .exec((err, rs)=>{
    var data = [];
    rs.map((inven)=>{
      if(inven.product_id != null){
        data.push(inven)
      } 
    })
    allFuctions.live_wise_inventory(data, (docs)=>{
      allFuctions.get_allProduct_page(res, docs, "Sub Category")
    })
  })
};

// getting product models by Sub category
exports.getProductByCat_filter = (req, res, next)=>{
  Inventory.find({})
  .populate({
    path:"product_id",
    match:{"category": req.params.cat}
  })
  .exec((err, rs)=>{
    var data = [];
    rs.map((inven)=>{
      if(inven.product_id != null){
        data.push(inven)
      } 
    })
    allFuctions.live_wise_inventory(data, (docs)=>{
      allFuctions.get_allProduct_page(res, docs, "Category")
    })
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

// adding new serial during edit lot
exports.editAddNew = (req, res, next) => {
  var new_serial = req.body.new_serial;
  var lot_id = req.params.lot_id;
  var pid = req.params.pid; 
  var addToSet_obj = { serial: new_serial, original_serial: new_serial};
  var inc_obj = { stockQuantity: 1, remaining: 1 };

  if(req.body.msg_err === "No"){
    Inventory.update({ _id: lot_id },{ $addToSet: addToSet_obj, $inc: inc_obj}, { upsert:true }, (err,docs)=>{
      if(err){ res.send(err); }
      else{
        res.redirect("/products/stockEditPage/"+ lot_id+"/"+pid)
      }
    })
  }else{
    req.flash("error_msg", "Given serial number already exists!");
    res.redirect("/products/stockEditPage/"+ lot_id+"/"+pid)
  }
};

// returns Online Product page
exports.getOnlineProductsPage =async (req, res, next) => {
  var populate_obj = {
    path:"product_id",
    match: { isActive:true }
  };

  let docs = await allFuctions.get_inventory_list_new({},{ "product_id": 1 },populate_obj)
    allFuctions.live_wise_inventory(docs, (rs)=>{
      allFuctions.get_allProduct_page(res, rs, "Inventories")
  })
};

// returns Offline Product page
exports.getOfflineProductsPage =async (req, res, next) => {
  var populate_obj = {
    path:"product_id",
    match: { isActive:false }
  };
  let docs = await allFuctions.get_inventory_list_new({},{ "product_id": 1 },populate_obj)
  allFuctions.live_wise_inventory(docs, (rs)=>{
    allFuctions.get_allProduct_page(res, rs, "Inventories")
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
      render_obj.num =  docs1[0].feature.length;
      render_obj.status ="exist";
      render_obj.features = docs1[0].feature;
    }
    res.render("products/reg", render_obj);
  });
};

// save live
exports.saveLive =async (req, res, next) => {
  var quantity = req.body.quantity;
  var product_id = req.params.id;
  var unitPrice = req.body.unit_price;
  var remaining = req.body.remaining;
  var serial_obj = (req.body.serial).split(",");
  var live_serial = [];

  serial_obj.map((serial_no)=>{
    var obj = {
      serial: serial_no,
      inventory: req.body.lot_number
    }
    live_serial.push(obj);
  })
  var inc_ob = { frontQuantity: +quantity, "live.quantity": +quantity };
  var set_ob = { unitPrice: unitPrice, "live.admin": req.user._id };
  
  Product.update({_id: product_id}, { $addToSet: { "live.serial": live_serial }, $inc: inc_ob, $set: set_ob}, {upsert:true},(err, docs)=>{
    Inventory.update({_id:req.body.lot_number}, {$pull: { serial: { $in: serial_obj } }, $set:{"remaining":(parseInt(remaining)-quantity)}},
    { upsert: true },function(err, docs){
      if(err){ res.send(err); }
      req.flash("success_msg", "Live Product Added");
      res.redirect("/Products/liveStockEdit/"+req.body.lot_number+"/"+req.params.id);
    }) 
  })
};

// get lot without serial page
exports.saveInventoryNoSerial= (req, res, next) => {
  var quantity = parseInt(req.body.quantity);
  var serials= [];
  for(var i=0; i<quantity; i++){
    serials.push((mongoose.Types.ObjectId()).toString())
  }
  var inventory = {
    product_id: req.body.model,
    stockQuantity: req.body.quantity,
    purchasePrice: req.body.purchase_price,
    remaining: req.body.quantity,
    admin: req.user._id,
    original_serial: serials,
    serial: serials
  }
  Product.update({_id:req.body.model}, { $set:{ warranted: false } },{ upsert:true }, (err, rs)=>{
    if(err){
      console.log(err)
    }else{
      new Inventory(inventory).save().then(inventory => {
        res.redirect("/products/saveInventoryNoSerialPage");
      });
    }
  })
};

// check availability
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
    admin: req.user._id
  }
  Product.update({_id:req.body.model}, { $set:{ warranted: true } },{ upsert:true }, (err, rs)=>{
    if(err){
      console.log((err))
    }else{
      new Inventory(inventory).save().then(inventory => {
        res.json({})
      });
    }
  }) 
};

// viewProducts
exports.viewProducts = (req, res)=>{
  Product.find().sort({"created": -1}).exec((err, docs)=>{
    
    res.render("products/viewProducts", {products:docs})
  })
}
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
      if(req.body.new_feat_1 === "" || req.body.v1 === ''){}else{
       
        data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_1 + "\",\"value\":\"" + req.body.v1 + "\"}"));
        features_new.push(req.body.new_feat_1);
      }
     
        if(req.body.new_feat > 1){
          if(req.body.new_feat_2 === "" || req.body.v2 === ""){}else{
            data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_2 + "\",\"value\":\"" + req.body.v2 + "\"}"));
            features_new.push(req.body.new_feat_2);
          }
         
          if(req.body.new_feat > 2){
            if(req.body.new_feat_3 === "" || req.body.v3 === ""){}else{
              data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_3 + "\",\"value\":\"" + req.body.v3 + "\"}"));
              features_new.push(req.body.new_feat_3);
            }
           
            if(req.body.new_feat > 3){
              if(req.body.new_feat_4 === "" || req.body.v4 === ""){}else{
                data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_4 + "\",\"value\":\"" + req.body.v4 + "\"}"));
                features_new.push(req.body.new_feat_4);
              }
              
              if(req.body.new_feat > 4){
                if(req.body.new_feat_5 === "" || req.body.v5 === ""){}else{
                  data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_5 + "\",\"value\":\"" + req.body.v5 + "\"}"));
                  features_new.push(req.body.new_feat_5);
                }
                if(req.body.new_feat > 5){
                  if(req.body.new_feat_6 === "" || req.body.v6 === ""){}else{
                    data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_6 + "\",\"value\":\"" + req.body.v6 + "\"}"));
                    features_new.push(req.body.new_feat_6);
                  }
                  
                  if(req.body.new_feat > 6){
                    if(req.body.new_feat_7 === "" || req.body.v7 === ""){}else{
                      data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_7 + "\",\"value\":\"" + req.body.v7 + "\"}"));
                      features_new.push(req.body.new_feat_7);
                    }
                   
                    if(req.body.new_feat > 7){
                      if(req.body.new_feat_8 === "" || req.body.v8 === ""){}else{
                        data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_8 + "\",\"value\":\"" + req.body.v8 + "\"}"));
                        features_new.push(req.body.new_feat_8);
                      }
                      if(req.body.new_feat > 8){
                        if(req.body.new_feat_9 === "" || req.body.v9 === ""){}else{
                          data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_9 + "\",\"value\":\"" + req.body.v9 + "\"}"));
                          features_new.push(req.body.new_feat_9);
                        }
                        if(req.body.new_feat > 9){
                          if(req.body.new_feat_10 === "" || req.body.v10 === "" ){}else{
                            data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_10 + "\",\"value\":\"" + req.body.v10 + "\"}"));
                            features_new.push(req.body.new_feat_10);  
                          }  
                          if(req.body.new_feat > 10){
                            if(req.body.new_feat_11 === "" || req.body.v11 === "" ){}else{
                              data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_11 + "\",\"value\":\"" + req.body.v11 + "\"}"));
                              features_new.push(req.body.new_feat_11);  
                            } 
                            if(req.body.new_feat > 11){
                              if(req.body.new_feat_12 === "" || req.body.v12 === "" ){}else{
                                data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_12 + "\",\"value\":\"" + req.body.v12 + "\"}"));
                                features_new.push(req.body.new_feat_12);  
                              }  
                              if(req.body.new_feat > 12){
                                if(req.body.new_feat_13 === "" || req.body.v13 === "" ){}else{
                                  data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_13 + "\",\"value\":\"" + req.body.v13 + "\"}"));
                                  features_new.push(req.body.new_feat_13);  
                                } 
                                if(req.body.new_feat > 13){
                                  if(req.body.new_feat_14 === "" || req.body.v14 === "" ){}else{
                                    data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_14 + "\",\"value\":\"" + req.body.v14 + "\"}"));
                                    features_new.push(req.body.new_feat_14);  
                                  }   
                                  if(req.body.new_feat > 14){
                                    if(req.body.new_feat_15 === "" || req.body.v15 === "" ){}else{
                                      data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_15 + "\",\"value\":\"" + req.body.v15 + "\"}"));
                                      features_new.push(req.body.new_feat_15);  
                                    } 
                                    if(req.body.new_feat > 15){
                                      if(req.body.new_feat_16 === "" || req.body.v16 === "" ){}else{
                                        data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_16 + "\",\"value\":\"" + req.body.v16 + "\"}"));
                                        features_new.push(req.body.new_feat_16);  
                                      }
                                      if(req.body.new_feat > 16){
                                        if(req.body.new_feat_17 === "" || req.body.v17 === "" ){}else{
                                          data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_17 + "\",\"value\":\"" + req.body.v17 + "\"}"));
                                          features_new.push(req.body.new_feat_17);  
                                        } 
                                        if(req.body.new_feat > 17){
                                          if(req.body.new_feat_18 === "" || req.body.v18 === "" ){}else{
                                            data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_18 + "\",\"value\":\"" + req.body.v18 + "\"}"));
                                            features_new.push(req.body.new_feat_18);  
                                          }     
                                          if(req.body.new_feat > 18){
                                            if(req.body.new_feat_19 === "" || req.body.v19 === "" ){}else{
                                              data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_19 + "\",\"value\":\"" + req.body.v19 + "\"}"));
                                              features_new.push(req.body.new_feat_19);  
                                            } 
                                            if(req.body.new_feat > 19){
                                              if(req.body.new_feat_20 === "" || req.body.v20 === "" ){}else{
                                                data.push(JSON.parse("{\"label\":\"" + req.body.new_feat_20 + "\",\"value\":\"" + req.body.v20 + "\"}"));
                                                features_new.push(req.body.new_feat_20);  
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
      subcategoryName: req.body.subN,
      brandName: req.body.brandN,
      weight: req.body.weight,
    };
    
    if( req.body.sub === "null" ){}
    else{
      newProduct.subcategory= req.body.sub
    }
    
    new Product(newProduct).save().then(product => {
    Category.update({ _id: selected_category }, { $addToSet: { brands: selected_brand} },{ upsert: true },
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
      if (err){
        req.flash("error_msg", "Something went wrong! Try again.");
      }else{
        req.flash("success_msg", "Product Added");
      } 
      res.redirect("/category/Entry");
    })
  })
  }else{
    req.flash("error_msg", "please submit the form with category,sub category and brand before filling product info!");
    res.redirect("/category/Entry");
  }
};

exports.update_product = (req, res, next) => {
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
      resolve();
      })
    } else {
      array = "";
      resolve();
    }
  })
  pro.then(() => {
    
    if (array != "") {
      obj = {
        'name': req.body.title1,
        'image': array,
        'weight': req.body.weight,
        'model': req.body.model,
        'warranty': req.body.warranty,
        'description': req.body.description,
        'shippingInfo': req.body.shippingInfo,
        'features': data
      }
    }else{
      obj={
        'name': req.body.title1,
        'weight': req.body.weight,
        'model': req.body.model,
        'warranty': req.body.warranty,
        'description': req.body.description,
        'shippingInfo': req.body.shippingInfo,
        'features': data
      }
    }
    Product.findOneAndUpdate({ _id: mongo.ObjectID(req.params.pid) },{ $set: obj }, { upsert: true },(err, docs)=>{
      if (err) { res.send(err); }
    })
  })

  pro.then(() => {
    if (req.file) {
      gfs.remove({ filename: req.file.filename }, (err) => {
        if (err) console.log(err)
        res.redirect("/products/Edit/"+req.params.pid)
      })
    }else{
      res.redirect("/products/Edit/"+req.params.pid)
    }
  })
}

// 892
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
