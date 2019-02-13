const express = require("express");

const Invoice = require("../models/invoice.model");

// view list of customers
exports.showInvoiceList = (req, res, next) => {
    
    Invoice.find({})
    .populate("user")
    .populate("order")
    .exec((err, rs)=>{
        if(err) res.send(err)
        console.log(rs);
        res.render("invoiceList",{ invoices:rs });
    })
};

