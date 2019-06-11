// author: Fathma siddique
// lastmodified: 26/5/2019
// description: the file has all the Customer related controllers/ functions
const Customerr = require('../models/userCustomer');

// view list of customers
exports.viewListOfCustomers = (req, res) => {
    Customerr.find(( err, docs )=> res.render('customer/customerlist',{ customer: docs }) )
};

