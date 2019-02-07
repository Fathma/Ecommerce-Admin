const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

var CustomerOrderSchema = new Schema({
    created: { type: Date,default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'Customer' },
    cart: { type: Object },
    name: { type: String },
    phone: { type: Number },
    address: { type: String },
    city: { type: String },
    division: { type: String },
    paymentId: { type: String },
    totalAmount: { type: Number },
    currentStatus:{ type: String },
    lastModified:{ type: Date},
    shippingCost:{ type: Number },
    paymentMethod:{ type: String },
    history: { type: Array }
    //     {
    //     date: { type: Date, default: Date.now },
    //     comment: { type: String },
    //     status: { type: String },
    //     customerNotified: { type: String }
    // }


});

// CustomerOrderSchema.plugin(mongoosastic);

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema, 'customerOrders');