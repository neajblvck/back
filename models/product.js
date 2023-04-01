const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nameProduct: {type: String, require : true},
    category: {type: String, require : true},
    descriptionProduct: {type: String, require : true},
    imageUrl: { type: String, required: true },
    prixProduct: {type: Number, require : true},
    prixMenu: {type: Number, require : false},
    available: {type: Boolean, require : true}
})

module.exports = mongoose.model('productModel', productSchema);