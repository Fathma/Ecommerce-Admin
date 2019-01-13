const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String },
    image: String,
    color: { type: String, default: 'N/A'},
    description: { type: String, default: 'None'},
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    model: { type: String, required: false },
    warranty: { type: String, required: false },
    pinned: { type: String, required: false },
    home: { type: String, required: false },
    features: { type: Array, required: false },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    quantity: {
      stock: { type: Number, default: 0},
      storeLive: { type: Number, default: 0 },
      stock_last_update: {type:Date, default:Date.now},
      userID:{ type: Schema.Types.ObjectId, ref: 'users' },
    },
    serial:{ type: Array},
    productPrice: {
        listPrice: { type: Number, default: 0},
        salePrice: { type: Number, default: 0},
        wholeSalePrice: { type: Number, default: 0}
    },
    isActive: Boolean,
    onSale: Boolean,
    shippingInfo: {type:String, default:'None'},
    created: { type: Date, default: Date.now },


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


