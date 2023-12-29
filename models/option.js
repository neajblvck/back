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

module.exports = OptionSchema;