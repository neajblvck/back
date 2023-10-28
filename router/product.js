// PPRODUCTS ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const deleteImage = require('../middleware/deleteImage');
const {Product, Category} = require('../models/product');

const multer = require('../middleware/multer-config');

const productController = require('../controller/product');



// Routes pour les Ensemble
router.post('/ensemble', productController.createEnsemble); 
router.get('/ensemble', productController.getAllEnsembles);
router.put('/ensemble/:id', productController.updateEnsemble);
router.delete('/ensemble/:id', productController.deleteEnsemble);


// Routes pour les Catégories
router.post('/addToCategory/:id', multer, productController.addProductToCategory); 
router.post('/categories', multer, productController.createCategory); 
router.get('/categories', productController.getAllCategories);
router.put('/categories/:id', multer, productController.editCategory);
router.delete('/categories/:id', productController.deleteCategory);

router.put('/order/:id', productController.updateCategory);
router.put('/products/move', productController.moveProductsToCategory);
router.put('/products/copy', productController.copyProductsToCategory);
router.put('/products/remove', productController.removeProductFromCategory);

// Route PRODUIT
router.post('/', multer, productController.createProduct);
router.get ('/:id', productController.getOneProduct);
router.get ('/', productController.getAllProduct);
router.patch('/:id', multer, productController.editProduct);
router.delete('/:id', productController.deleteProduct, deleteImage(Product, 'imageUrl'));

// Route ordre OPTION
router.post('/options', productController.createOption);
router.delete('/options/:id', productController.deleteOption);
router.put('/options/:id/options-order', productController.updateOptionsOrder);





module.exports = router;