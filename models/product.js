const mongoose = require('mongoose');

// Modèle d'option
const optionSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
});

const Option = mongoose.model('Option', optionSchema);

// Modèle de produit
const productSchema = mongoose.Schema({
  nameProduct: { type: String, required: true },
  descriptionProduct: { type: String, required: true },
  imageUrl: { type: String, required: true },
  prixProduct: { type: Number, required: true },
  prixMenu: { type: Number, required: false },
  available: { type: Boolean, required: true },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  optionsOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }]
})

const Product = mongoose.model('Product', productSchema);

// Modèle de catégorie de produit
const categorySchema = new mongoose.Schema({
  titleCategory: { type: String, required: true },
  descriptionCategory: { type: String, required: false },
  imgCategory: { type: String, required: false },
  orderCategory: {
    type: Number,
    unique: false,
    required: false,
    default: 0
},
  products: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    set: ids => [...new Set(ids.map(id => id.toString()))]

  }
});


const Category = mongoose.model('Category', categorySchema);


const ensembleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
});

const Ensemble = mongoose.model('Ensemble', ensembleSchema);



module.exports = { Product, Category, Option, Ensemble }