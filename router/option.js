const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const multer = require('../middleware/multer-config');
const optionController = require('../controller/option');

// Route OPTION
router.get ('/', authMiddleware, optionController.getAllOptions);
// router.get('/:id', authMiddleware, optionController.getOneProduct);
router.post('/', authMiddleware, multer, optionController.createOption);
router.patch('/:id', authMiddleware, multer, optionController.editOption);
// router.delete('/deleteFromCategory/:id', authMiddleware, multer, optionController.removeProductFromCategory);
router.delete('/:id', authMiddleware, optionController.deleteOption);


// Routes pour les Options
// router.post('/options', authMiddleware, multer, optionController.createOption); 
// router.get('/options', optionController.getAllOptions);
// router.get('/options/:id', optionController.getOptionById);
// router.patch('/options/:id', authMiddleware, multer, optionController.updateOption);
// router.delete('/options/:id', authMiddleware, optionController.deleteOption);

// router.post('/options/addToProduct/:id', authMiddleware, optionController.addOptionToProduct);


// Routes pour les Catégories

// router.put('/order/:id', optionController.updateProductOrder);
// router.put('/products/move', optionController.moveProductsToCategory);
// router.put('/products/copy', optionController.copyProductsToCategory);
// router.put('/products/remove', optionController.removeProductFromCategory);





module.exports = router;