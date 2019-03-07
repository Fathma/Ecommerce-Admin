

// const returns = require("../models/return.model");

// view list of Returns
exports.showReturnList = (req, res, next) => {
    res.render("return/returns");
};

// view return details
exports.showReturnDetails = (req, res, next) => {
    res.render("return/editReturn");
};

// view 
exports.addReturnPage = (req, res, next) => {
    res.render("return/addReturn");
};


