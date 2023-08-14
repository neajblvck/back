const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
    titlePost: {type: String, required: false},
    descriptionPost: { type: String, required: false },
    imgPost: { type: String, required: false }
})





const heroSchema = mongoose.Schema({
    title: {type: String, required: false},
    imgPost: { type: String, required: false }
})

const heroModel = mongoose.model('heroModel', heroSchema);
const homeModel = mongoose.model('homeModel', homeSchema);

module.exports = { heroModel, homeModel };