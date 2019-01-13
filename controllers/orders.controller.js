const express = require("express");

const order = require("../models/orders.model");

// view list of customers
exports.showOrdersPage = (req, res, next) => {
   
    res.render("orders/orders");
   
};

// view list of customers
exports.showOrderDetails = (req, res, next) => {
   
    res.render("orders/orderDetails");
   
};


