

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const emailValidator = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const userSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant'
  },
  name: { type: String, required: true, unique: false},
  surname: { type: String, required: false, unique: false },
  phone: { type: String, required: false, unique: false },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: [emailValidator, 'Veuillez entrer une adresse email valide']
  },
  password: { type: String, required: true },
  permissions: { type: String, required: false, unique: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('userModel', userSchema);
// module.exports = userSchema;

