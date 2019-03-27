const Customerr = require("../models/userCustomer");

// view list of customers
exports.viewListOfCustomers = (req, res, next) => {
    Customerr.find(function(err, docs){
        res.render("customerlist",{customer: docs});
    })
};

