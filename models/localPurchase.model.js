const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var LocalPurchaseSchema = new Schema({
    number: { type: String, unique: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    contactPerson: { type: String },
    mobile: { type: String },
    products:[{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity:{ type: Number},
        purchasePrice:{ type: Number}
    }]
});
module.exports = mongoose.model('LocalPurchase', LocalPurchaseSchema, 'LocalPurchases');