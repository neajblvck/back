const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
    titlePost: {type: String, required: false},
    descriptionPost: { type: String, required: false },
    imgPost: { type: String, required: false }
})

module.exports = mongoose.model('homeModel', homeSchema);