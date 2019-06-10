const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var BrandSchema = new Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', BrandSchema, 'brands');