// author: Fathma siddique
// lastmodified: 16/6/2019
// description: the file has all the Customer related controllers/ functions
const Customerr = require('../models/userCustomer');
const Email = require('../helpers/email')

exports.emailAllPage = ( req, res )=> res.render('customer/emailAll')

// view list of customers
exports.viewListOfCustomers = (req, res) => {
    Customerr.find(( err, docs )=> res.render('customer/customerlist',{ customer: docs }) )
};


exports.singleView = (req, res) => {
    Customerr.find({ _id: req.params.id },( err, docs )=> res.render('customer/singleCustomer',{ customer: docs }) )
};

// email all customer at once
exports.emailAll = ( req, res )=>{
    let emails = [] 
    Customerr.find((err, customers)=>{
        customers.map(customer=>{
            emails.push(customer.email)
        })
        Email.sendEmail( 'devtestjihad@gmail.com', emails, req.body.subject , '<p>Dear Sir,\n</p><p>' + req.body.body + '</p>\n<p>Thanks</p>\n<p>ECL</p></p>' );
    })
}