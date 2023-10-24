// const multer = require('multer');

// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png' : 'png'
// }

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'images')
//     },
//     filename: (req, file, callback) =>{
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name + Date.now() + '.' + extension)
//     }
// });





// module.exports = multer({ storage }).fields([
//     { name: 'imgHero', maxCount: 1 },
//     { name: 'image', maxCount: 1 },
//     { name: 'imgPost', maxCount: 1 },
//     { name: 'imgPromo2', maxCount: 1 },
//     { name: 'imgPromo3', maxCount: 1 },
// ]);


const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png' : 'png'
    // Vous pouvez ajouter d'autres types MIME si nécessaire.
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // Nettoyer le nom du fichier
        const name = cleanFilename(file.originalname);

        // Vérifier l'extension
        const extension = MIME_TYPES[file.mimetype];
        if (!extension) {
            // Refuser le fichier si le type MIME n'est pas reconnu
            callback(new Error('Type MIME non pris en charge'), null);
            return;
        }

        callback(null, file.fieldname + name + Date.now() + '.' + extension);
    }
});

function cleanFilename(filename) {
    // Supprime les caractères non alphanumériques et remplace les espaces par des underscores
    return filename.replace(/\W+/g, '_');
}

const fileFilter = (req, file, callback) => {
    // Vérifier si le type MIME est autorisé
    if (!MIME_TYPES[file.mimetype]) {
        callback(new Error('Type de fichier non autorisé'), false);
    } else {
        callback(null, true);
    }
};

module.exports = multer({ 
    storage,
    fileFilter // Filtre ajouté pour valider les types de fichiers.
}).fields([
    { name: 'imgHero', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'imgPost', maxCount: 1 },
    { name: 'imgCategory', maxCount: 1 },
    // { name: 'imgPromo3', maxCount: 1 },
]);

