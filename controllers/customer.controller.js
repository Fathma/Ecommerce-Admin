const express = require("express");

const Customerr = require("../models/customer");

// view list of customers
exports.viewListOfCustomers = (req, res, next) => {
    Customerr.find(function(err, docs){
        res.render("customerlist",{customer: docs});
    })
};

