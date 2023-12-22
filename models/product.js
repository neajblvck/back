const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
  
  choiceItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    refPath: 'choiceType', 
},
  choiceName: { 
    type: String,
    required: false,
  },
  additionalCost: {
    type: Number,
    required: true,
    default: 0,
  },
});

const OptionSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  name: { type: String, required: true },
  qtMinimal: {type:Number, required: false},
  qtMaximal: {type:Number, required: false},
  multiply: {type: Boolean, required: false},
  extraCost: {type: Number, required: false},
  choices: [ChoiceSchema],
  choiceType: {
    type: String,
    required: true,
    enum: ['Product', 'CustomChoice'],
}
});

const Options = mongoose.model('Options', OptionSchema);

// Modèle de produit
const productSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  nameProduct: { type: String, required: true },
  descriptionProduct: { type: String, required: true },
  imageUrl: { type: String, required: true },
  prixProduct: { type: Number, required: true },
  available: { type: Boolean, required: true },
  customProducts: [{
    choice: { type: String, required: true },
    additionalCost: { type: Number, required: true, default: 0 },
  }],
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Options' }],
  optionsOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Options' }]
})

const Product = mongoose.model('Product', productSchema);



// Modèle de catégorie de produit
const categorySchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
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
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  name: { type: String, required: true },
  categoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
});

const Ensemble = mongoose.model('Ensemble', ensembleSchema);



module.exports = { Product, Category, Options, Ensemble }