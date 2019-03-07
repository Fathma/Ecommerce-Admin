const express = require("express");

const Invoice = require("../models/invoice.model");

// view list of customers
exports.showInvoiceList = (req, res, next) => {
    
    Invoice.find({})
    .sort({ "created": -1 })
    .populate("user")
    .populate("order")
    .exec((err, rs)=>{
        if(err) res.send(err)
        res.render("invoiceList",{ invoices:rs });
    })
};

