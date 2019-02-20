const express = require("express");

const allFuctions = require("../functions/allFuctions");
const Customer = require("../models/userCustomer");
const Invoice = require("../models/invoice.model");
const Product = require("../models/Product");
const Order = require("../models/customerOrder");
const Email = require("../Email/email");
var async = require('async');
const Inventory = require("../models/inventory.model");


exports.s = (req, res, next) => {
 var data = {
  
  "currentStatus": "New Order",
  "history": [
     
  ],
  "user":  "5c5ac40d6d91a968f880cc43"
 ,
  "cart": [
      {
          "product": "5c595870d437a91b00386cf3",
          "quantity": 1,
          "unitPrice": 12000,
          "price": 12000
        
      }
  ],
  "name": "Md. Jihad Hossain",
  "phone": 1714848867,
  "address": "14/6 Tareq Vila(2nd Floor), Dhanmondi 4/A, Dhaka-1209, 14/6 Tareq Vila(2nd Floor)",
  "city": "Dhaka",
  "division": "Dhaka",
  "paymentMethod": "Stripe",
  "paymentId": "ch_1E17JYCuJbLKcHMCmqMaWpys",
  "shippingCost": 100,
  "totalAmount": 12000,
  
  
  "__v": 0
}
new Order(data).save().then(product => {})
   
};

// view list of customers
exports.showOrdersPage = (req, res, next) => {
  allFuctions.get_orders({}, rs => {
   
    res.render("orders/orders", { orders: rs });
  });
};

// saving serial for order
exports.saveSerialInOrders = (req, res, next) => {
  var serials = req.body.Serial.split(",");
  Order.update(
    { _id: req.params.oid, "cart._id": req.params.item_id },
    { $set: { "cart.$.serial": serials } },
    { upsert: true },
    (err, rs) => {
      
      if (err) res.send(err);
      res.redirect("/orders/orderDetails/" + req.params.oid);
    }
  );
};

exports.saveEdit = (req, res, next) => {
  Order.find({ _id: req.params.oid }, (err, docs) => {
    // console.log(docs.shippingCharge);
    var total = 0;

    docs[0].cart.map(items => {
      if (items._id != req.params.item_id) {
        total += items.price;
      }
    });

    Order.update(
      { _id: req.params.oid, "cart._id": req.params.item_id },
      {
        $set: {
          "cart.$.quantity": req.body.quantity,
          "cart.$.price": req.body.quantity * parseInt(req.body.unitprice),
          totalAmount:
            total + parseInt(req.body.quantity) * parseInt(req.body.unitprice)
        }
      },
      { upsert: true },
      (err, rs) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/orders/orderDetails/" + req.params.oid);
        }
      }
    );
  });
};

// returns the page to add serial to an ordered product
exports.addSerialToProduct = (req, res, next) => {
  allFuctions.get_orders({ _id: req.params.oid }, rs => {
    Live.find({ product_id: req.params.pid }, function(err, docs) {
      res.render("orders/setSerialInOrder", {
        order: rs[0],
        model: req.params.pid,
        model_name: req.params.pmodel,
        item_id: req.params.item_id,
        quantity: req.params.quantity,
        serial: docs[0].serial
      });
    });
  });
};

exports.getEditOrderPage = (req, res, next) => {
  res.render("orders/editOrder", {
    oid: req.params.oid,
    model: req.params.pid,
    model_name: req.params.pmodel,
    unitprice: req.params.unitprice,
    quantity: req.params.quantity,
    item_id: req.params.item_id,
    totalAmount: req.params.total
  });
};

// view list of customers
exports.ViewInvoice = (req, res, next) => {
  Invoice.find({ _id: req.params.id })
    .populate("user")
    .populate({
      path: "order",
      populate: { path: "user" }
    })
    .populate({
      path: "order",
      populate: { path: "cart.product" }
    })
    .exec((err, rs) => {
      var count = 1;
      for (var i = 0; i < rs[0].order.cart.length; i++) {
        rs[0].order.cart[i].num = count;
        count++;
      }
      res.render("orders/viewInvoice", { invoice: rs[0] });
    });
};

// view list of customers
exports.showOrderDetails = (req, res, next) => {
  allFuctions.get_orders({ _id: req.params.id }, rs => {
    for (var i = 0; i < rs[0].cart.length; i++) {
      rs[0].cart[i].oid = req.params.id;
      rs[0].cart[i].totalAmount = rs[0].totalAmount;
    }
    res.render("orders/orderDetails", { order: rs[0], or_id: req.params.id });
  });
};

// view list of customers
exports.generateInvoice = (req, res, next) => {
  var invoice = {
    user: req.user._id,
    order: req.params.oid
  };

  new Invoice(invoice).save().then(invoice => {
    Order.update(
      { _id: req.params.oid },
      { $set: { invoice: invoice._id } },
      (err, docs) => {
        allFuctions.get_orders({ _id: req.params.oid }, rs => {
          var count = 1;
          for (var i = 0; i < rs[0].cart.length; i++) {
            rs[0].cart[i].num = count;
            count++;
          }
          res.render("orders/invoice", {
            title: "Invoice",
            order: rs[0],
            user: req.user,
            invoice: invoice._id
          });
        });
      }
    );
  });
};

// updateting order history
exports.updateHistory = (req, res, next) => {
  var status = req.body.status;

  if (req.body.notify === "1") {
    var notify = "Yes";
    Email.sendEmail(
      "devtestjihad@gmail.com",
      req.body.email,
      "ECL update",
      "<h2>" + req.body.comment + "</h2>"
    );
  } else {
    var notify = "No";
  }

  var history = {
    date: new Date(),
    comment: req.body.comment,
    status: req.body.status,
    customerNotified: notify
  };

  if (status === "Delivered") {
    Order.findOneAndUpdate(
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
        } else {
          rs.cart.map(item => {
            var arr = item.serial;
            console.log(item.serial)
            if(item.serial.length != 0){
              console.log("if")
              Live.update(
                { product_id: item.product },
                { $pull: { serial: { $in: arr } }, $inc: {quantity: -arr.length} },
                (err, rs) => {
                  if (err) {
                    res.send(err);
                  } else {
                    Inventory.update({ product_id: item.product },{$inc:{live:-arr.length}}, (err, rs)=>{
                      console.log("update");
                    })
                  }
                }
              );
            }else{
              console.log("else")
              Live.update(
                { product_id: item.product },
                {  $inc: {quantity: -item.quantity} },
                (err, rs) => {
                  if (err) {
                    res.send(err);
                  } else {
                    Inventory.update({ product_id: item.product },{$inc:{live:-item.quantity}}, (err, rs)=>{
                      console.log("update");
                    })
                  }
                }
              );
            }
            
          });
        }
        res.redirect("/orders/orderDetails/" + req.params.oid);
      }
    );
  }else{
    Order.findOneAndUpdate(
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
      
        res.redirect("/orders/orderDetails/" + req.params.oid);
      }
    );
  }
};
