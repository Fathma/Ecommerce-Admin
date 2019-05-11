const express = require("express");

const Invoice = require("../models/invoice.model");

// view list of customers
exports.showInvoiceList = (req, res)=>{
    Invoice.find()
    .sort({ "created": -1 })
    .populate("user")
    .populate("order")
    .exec((err, rs)=> res.render("invoiceList",{ invoices: rs }))
};

