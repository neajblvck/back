const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    titlePost: String,
    descriptionPost: String,
    imgPost: String
});

const heroSchema = new mongoose.Schema({
    imgHero: String,
});

const validHexColor = {
    type: String,
    required: true,
    // trim: true,
    match: /^#[0-9A-F]{6}$/i
};

const styleSchema = new mongoose.Schema({
    singleton: {
        type: Boolean,
        default: true,
        unique: true
    },
    backgroundColor: {
        ...validHexColor,
        default: '#FFFFFF',
    },
    homeColor: {
        ...validHexColor,
        default: '#FFFFFF',
    },
    moduleColor: {
        ...validHexColor,
        default: '#FFFFFF',
    },
    titleColor: {
        ...validHexColor,
        default: '#000000', 
    },
    textColor: {
        ...validHexColor,
        default: '#000000',
    },
    buttonColor: {
        ...validHexColor,
        default: '#FF0000',
    }
});


module.exports = {styleSchema, heroSchema, homeSchema};





// const publicStyle = mongoose.model('publicStyle', publicStyleSchema);
// const heroModel = mongoose.model('heroModel', heroSchema);
// const homeModel = mongoose.model('homeModel', homeSchema);

// module.exports = { heroModel, homeModel, publicStyle };