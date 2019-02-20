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
    weight:  {type:String},
    // v1
    frontQuantity: {type:Number, default:0},
    live: { 
        quantity: {type:Number,default:0},
        serial: {type: Array,default:[]},
        admin: { type: Schema.Types.ObjectId, ref: 'users' },
        created: { type: Date, default: Date.now }, 
    },
    
    unitPrice: { type: Number , default:0},
    isActive:{ type: Boolean, default: false },
    
    status: { type: Boolean, required: false },
    admin: { type: Schema.Types.ObjectId, ref: 'users' },
    
    created: { type: Date, default: Date.now },

});


// ProductSchema
// .virtual('avarageRating')
// .get(function(){
//     var rating = 0;
//     if(this.reviews.length == 0){
//         rating = 0;
//     } else{
//         this.reviews.map((reviw) =>{
//             rating += reviw.rating;
//         });
//         rating = rating / this.reviews.length;
//     }
//     return rating;
// });



module.exports = mongoose.model('Product', ProductSchema, 'products');


