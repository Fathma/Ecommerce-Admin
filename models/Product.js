const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },

    categoryName: { type: String },
    subcategoryName: { type: String },
    brandName: { type: String },
    name: { type: String },
    model: { type: String, required: false },
    features: { type: Array, required: false },
    warranty: { type: String, required: false },
    description: { type: String, default: 'None'},
    shippingInfo: {type:String, default:'None'},
    image: String,
    
    live: { type: Schema.Types.ObjectId, ref: 'Live' },
    
    unitPrice: { type: Number },
    isActive:{ type: Boolean, required: false },
    status: { type: Boolean, required: false },
    admin: { type: Schema.Types.ObjectId, ref: 'users' },
    
    // pinned: { type: String, required: false },
    // home: { type: String, required: false },
    
    // quantity: {
    //   stock: { type: Number, default: 0},
    //   storeLive: { type: Number, default: 0 },
    //   stock_last_update: {type:Date, default:Date.now},
    //   userID:{ type: Schema.Types.ObjectId, ref: 'users' },
    // },
    // serial:{ type: Array},
    // productPrice: {
    //     listPrice: { type: Number, default: 0},
    //     salePrice: { type: Number, default: 0},
    //     wholeSalePrice: { type: Number, default: 0}
    // },
    isActive: Boolean,
    // onSale: Boolean,
    
    created: { type: Date, default: Date.now },

    // reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],


});


ProductSchema
.virtual('avarageRating')
.get(function(){
    var rating = 0;
    if(this.reviews.length == 0){
        rating = 0;
    } else{
        this.reviews.map((reviw) =>{
            rating += reviw.rating;
        });
        rating = rating / this.reviews.length;
    }
    return rating;
});



module.exports = mongoose.model('Product', ProductSchema, 'products');


