const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nameProduct: {type: String, required : true},
    category: {type: String, required : true},
    descriptionProduct: {type: String, require : true},
    imageUrl: { type: String, required: true },
    prixProduct: {type: Number, required : true},
    prixMenu: {type: Number, required : false},
    available: {type: Boolean, required : true}
})

module.exports = mongoose.model('productModel', productSchema);