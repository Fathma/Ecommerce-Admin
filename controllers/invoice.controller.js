const express = require("express");

const invoice = require("../models/invoice.model");

// view list of customers
exports.showInvoiceList = (req, res, next) => {
   
    res.render("invoiceList");
   
};

