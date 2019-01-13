const express = require("express");

const returns = require("../models/return.model");

// view list of customers
exports.showReturnList = (req, res, next) => {
   
    res.render("return/returns");
   
};

// view list of customers
exports.showOrderDetails = (req, res, next) => {
   
    res.render("orderDetails");
   
};


