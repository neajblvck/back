

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  name: { type: String, required: true, unique: false},
  surname: { type: String, required: false, unique: false },
  phone: { type: String, required: false, unique: false },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: false, unique: false },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('userModel', userSchema);
