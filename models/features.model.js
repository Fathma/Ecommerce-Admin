const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Text = require('../node_modules/text/lib/text');


var FeatureSchema = new Schema({
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    category:{ type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory:{ type: Schema.Types.ObjectId, ref: 'SubCategory' },
    feature:{ type:Array },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Features', FeatureSchema, 'features');