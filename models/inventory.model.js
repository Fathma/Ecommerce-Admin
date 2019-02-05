const mongoose = require('mongoose');
const Schema = mongoose.Schema;



var InventorySchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    stockQuantity: {type:Number},
    purchasePrice: {type: Number},
    remaining: {type: Number},
    live:{ type: Number },
    unitPrice:{type:Number, default:0},
    original_serial:{type:Array},
    serial:{type:Array},
    admin: { type: Schema.Types.ObjectId, ref: 'users' },
    created: { type: Date, default: Date.now },
    live_id: { type: Schema.Types.ObjectId, ref: 'Live' },
});

module.exports = mongoose.model('Inventory', InventorySchema, 'inventories');