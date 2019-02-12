const express = require("express");

const allFuctions = require("../functions/allFuctions");
const Customer = require("../models/userCustomer");
const Live = require("../models/live.model");
const Invoice = require("../models/invoice.model");
const Product = require("../models/Product");
const Order = require("../models/customerOrder");
const Email = require("../Email/email");

// view list of customers
exports.showOrdersPage = (req, res, next) => {
  allFuctions.get_orders({}, rs => {
    res.render("orders/orders", { orders: rs });
  });
};

// saving serial for order
exports.saveSerialInOrders= (req, res, next) => {
  var serials = (req.body.Serial).split(",");
  Order.update({ _id: req.params.oid, "cart._id" : req.params.item_id },{ $set: {"cart.$.serial": serials}}, {upsert:true},
   (err,rs)=>{
      if(err) res.send(err);
      res.redirect("/orders/orderDetails/"+req.params.oid);
    })
}

// returns the page to add serial to an ordered product
exports.addSerialToProduct  = (req, res, next) => {

  allFuctions.get_orders({ _id: req.params.oid }, (rs) => {
      Live.find({product_id:req.params.pid},function(err,docs){
          res.render("orders/setSerialInOrder", { order: rs[0], model:req.params.pid, model_name:req.params.pmodel, item_id: req.params.item_id, quantity:req.params.quantity, serial:docs[0].serial });
      })
  });
}

// view list of customers
exports.showOrderDetails = (req, res, next) => {
 
  allFuctions.get_orders({ _id: req.params.id }, rs => {
    
    for(var i=0;  i<rs[0].cart.length; i++){
      rs[0].cart[i].oid=req.params.id
    }
    console.log(rs[0].cart[0].oid)
    res.render("orders/orderDetails", { order: rs[0], or_id: req.params.id });
  });
};

// // view list of customers
// exports.setInvoiceValues = (req, res, next) => {
//   var previous = "";
//   //   var pro = new Promise(function(resolve, reject) {
//       console.log(req.params.oid)
//   allFuctions.get_orders({ _id: req.params.oid }, (rs) => {
//     if(rs[0].serial.length != 0){
//       for(var i=0; i<rs[0].serial.length; i++){
//         previous += rs[0].serial[i];
//         if(i != rs[0].serial.length-1){
//           previous +=",";
//         }
//       }
//     }else{
//       previous=null;
//     }
//     res.render("orders/generateInvoice", { title: "Invoice", order: rs[0], previous:previous});
//   });
// };

// view list of customers
exports.generateInvoice = (req, res, next) => {

  allFuctions.get_orders({ _id: req.params.oid }, rs => {
    res.render("orders/invoice", { title: "Invoice", order: rs[0], user:req.user});
  });
};

// updateting order history
exports.updateHistory = (req, res, next) => {
  var status = req.body.status;
  if (req.body.notify === "1") {
    var notify = "Yes";
  } else {
    var notify = "No";
  }

  var history = {
    date: new Date(),
    comment: req.body.comment,
    status: req.body.status,
    customerNotified: notify
  };
  Order.update(
    { _id: req.params.oid },
    {
      $addToSet: { history: history },
      currentStatus: status,
      lastModified: new Date()
    },
    { upsert: true },
    (err, rs) => {
      if (err) {
        console.log(err);
      }
      Email.sendEmail(
        "devtestjihad@gmail.com",
        req.body.email,
        "ECL update",
        "<h2>" + req.body.comment + "</h2>"
      );
      res.redirect("/orders/orderDetails/" + req.params.oid);
    }
  );
};
