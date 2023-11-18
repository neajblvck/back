const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
  choiceType: {
    type: String,
    required: true,
    enum: ['Product', 'CustomChoice'],
  },
  choiceItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    refPath: 'optionProducts.choiceType',
  },
  choiceName: { 
    type: String,
    required: true,
  },
  additionalCost: {
    type: Number,
    required: true,
    default: 0,
  },
});

const OptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qtMinimal: {type:Number, required: false},
  qtMaximal: {type:Number, required: false},
  multiply: {type: Number, required: false},
  extraCost: {type: Number, required: false},
  choices: [ChoiceSchema],
});

const Option = mongoose.model('Option', OptionSchema);

// Modèle de produit
const productSchema = mongoose.Schema({
  nameProduct: { type: String, required: true },
  descriptionProduct: { type: String, required: true },
  imageUrl: { type: String, required: true },
  prixProduct: { type: Number, required: true },
  prixMenu: { type: Number, required: false },
  available: { type: Boolean, required: true },
  customProduct: {type: String, required: false},
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  optionsOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }]
})

const Product = mongoose.model('Product', productSchema);

// Modèle de catégorie de produit
const categorySchema = new mongoose.Schema({
  titleCategory: { type: String, required: true },
  descriptionCategory: { type: String, required: false },
  imgCategory: { type: String, required: false },
  available: { type: Boolean, default: true, required: true },
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