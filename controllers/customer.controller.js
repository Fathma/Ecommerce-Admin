const Customerr = require("../models/userCustomer");

// view list of customers
exports.viewListOfCustomers = (req, res) => {
    Customerr.find(( err, docs )=>{
        res.render("customer/customerlist",{ customer: docs });
    })
};

