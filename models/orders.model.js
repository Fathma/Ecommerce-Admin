const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');


var OrderSchema = new Schema({
    // invoiceNo: { type: Schema.Types.ObjectId, ref: 'Brand' },
    Customer:  { type: String },
    email: { type: String },
    mobile: { type: Number},
    // orderStatus:{ type: String, default:"placed"},
    
    modifiedDate: { type: Date },
    orderDetails:{
        products:[{
            product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
            Quantity: { type: Number },
            total: { type: Number }
        }],
        shippingCost: { type: Number },
        // ecoTax (-2.00): 	$2.00
        VAT: { type: Number },
        subTotal:  { type: Number },
        Total: { type: Number },
    },
    history:{
        orderDate: { type: Date, default: Date.now },
        comment: { type: String },
        status: { type: String },
        customerNotified: { type: String }
    } 
    
});

module.exports = mongoose.model('Order', OrderSchema, 'Orders');
