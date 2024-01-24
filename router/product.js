// PPRODUCTS ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const multer = require('../middleware/multer-config');
const productController = require('../controller/product');

// Route PRODUIT
router.get ('/', authMiddleware, productController.getAllProducts);
// router.get('/:id', authMiddleware, productController.getOneProduct);
router.post('/addToCategory/:id', authMiddleware, multer, productController.addProductToCategory); 
router.post('/:id', authMiddleware, multer, productController.createProduct);
router.patch('/:id', authMiddleware, multer, productController.editProduct);
router.delete('/deleteFromCategory/:id', authMiddleware, multer, productController.removeProductFromCategory);
router.delete('/:id', authMiddleware, productController.deleteProduct);


// Routes pour les Options
// router.post('/options', authMiddleware, multer, productController.createOption); 
// router.get('/options', productController.getAllOptions);
// router.get('/options/:id', productController.getOptionById);
// router.patch('/options/:id', authMiddleware, multer, productController.updateOption);
// router.delete('/options/:id', authMiddleware, productController.deleteOption);

// router.post('/options/addToProduct/:id', authMiddleware, productController.addOptionToProduct);


// Routes pour les Catégories

// router.put('/products/move', productController.moveProductsToCategory);
// router.put('/products/copy', productController.copyProductsToCategory);
// router.put('/products/remove', productController.removeProductFromCategory);





module.exports = router;