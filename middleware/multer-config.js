const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png' : 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});





module.exports = multer({ storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'imgPost', maxCount: 1 },
    { name: 'imgPromo2', maxCount: 1 },
    { name: 'imgPromo3', maxCount: 1 },
]);

