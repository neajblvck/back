const mongoose = require('mongoose');

const dynamicCategorySchema = (tenantId) => {
  return new mongoose.Schema({
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
        ref: `Product_${tenantId}` // Référence dynamique au modèle Product spécifique au tenant
      }],
      set: ids => [...new Set(ids.map(id => id.toString()))]
    }
  });
};

module.exports = dynamicCategorySchema;