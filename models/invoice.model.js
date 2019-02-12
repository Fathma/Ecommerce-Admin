const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
    created: { type: Date,default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'Customer' },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    stockLocation:{ type: String }

});

module.exports = mongoose.model('Invoice', InvoiceSchema, 'Invoices');