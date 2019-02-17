const mongoose = require('mongoose');
const Schema = mongoose.Schema;



var LiveSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: {type:Number},
    purchasePrice: {type: Number},
    serial: {type: Array},
    unitPrice: {type: Number},
    inventory:[{ type: Schema.Types.ObjectId, ref: 'Inventory' }],
    admin: { type: Schema.Types.ObjectId, ref: 'users' },
    created: { type: Date, default: Date.now },
    frontQuantity: {type:Number}
});

module.exports = mongoose.model('Live', LiveSchema, 'lives');