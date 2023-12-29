const mongoose = require('mongoose');

const dynamicProductSchema = (tenantId) => {
  return new mongoose.Schema({
    nameProduct: { type: String, required: true },
    descriptionProduct: { type: String, required: true },
    imageUrl: { type: String, required: true },
    prixProduct: { type: Number, required: true },
    available: { type: Boolean, required: true },
    customProducts: [{
      choice: { type: String, required: true },
      additionalCost: { type: Number, required: true, default: 0 },
    }],
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: `Options_${tenantId}` }],
    optionsOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: `Product_${tenantId}` }]
  })
}

module.exports = dynamicProductSchema;