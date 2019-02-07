const express = require("express");

const allFuctions = require("../functions/allFuctions");
const Customer = require("../models/userCustomer");
const Order = require("../models/customerOrder");
const Email = require("../Email/email");

// view list of customers
exports.showOrdersPage = (req, res, next) => {
    allFuctions.get_orders({}, (rs)=>{
        res.render("orders/orders", {orders: rs});
    }) 
};

// view list of customers
exports.showOrderDetails = (req, res, next) => {
    allFuctions.get_orders({_id: req.params.id}, (rs)=>{
        res.render("orders/orderDetails", {order: rs[0]});
    })
};

// view list of customers
exports.generateInvoice = (req, res, next) => {
    allFuctions.get_orders({_id: req.params.oid}, (rs)=>{
        res.render("orders/invoice", {order: rs[0]});
    })
};

// updateting order history
exports.updateHistory = (req, res, next) => {
    var status =req.body.status;
    if(req.body.notify === "1"){
        var notify = "Yes";
    }else{
        var notify = "No";
    }
    
    var history ={
        date: new Date(),
        comment: req.body.comment ,
        status: req.body.status,
        customerNotified: notify
    }

    Order.update({_id: req.params.oid},{ $addToSet:{"history": history} , "currentStatus": status, "lastModified": new Date()},{upsert:true},(err,rs)=>{
        if(err){console.log(err)}
        Email.sendEmail("devtestjihad@gmail.com", req.body.email, "ECL update", "<h2>"+req.body.comment+"</h2>")
        res.redirect("/orders/orderDetails/"+req.params.oid);
    })  
};


