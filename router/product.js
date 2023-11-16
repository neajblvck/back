// PPRODUCTS ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const deleteImage = require('../middleware/deleteImage');
const {Product, Category} = require('../models/product');

const multer = require('../middleware/multer-config');

const productController = require('../controller/product');

// Routes pour les Options
router.post('/options', authMiddleware, multer, productController.createOption); 
router.get('/options', productController.getAllOptions);
router.get('/options/:id', productController.getOptionById);
router.patch('/options/:id', authMiddleware, multer, productController.updateOption);
router.delete('/options/:id', authMiddleware, productController.deleteOption);

router.post('/options/addToProduct/:id', authMiddleware, productController.addOptionToProduct);

// Routes pour les Choix au sein d'une Option
router.post('/options/:optionId/choices', authMiddleware, productController.addChoiceToOption); 
router.patch('/options/:optionId/choices/:choiceId', authMiddleware, productController.updateChoice);
router.delete('/options/:optionId/choices/:choiceId', authMiddleware, productController.deleteChoice);

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
router.put('/updateCategoriesOrder', productController.updateCategoryOrder);

router.put('/order/:id', productController.updateProductOrder);
router.put('/products/move', productController.moveProductsToCategory);
router.put('/products/copy', productController.copyProductsToCategory);
router.put('/products/remove', productController.removeProductFromCategory);

// Route PRODUIT
router.post('/', multer, productController.createProduct);
router.get ('/:id', productController.getOneProduct);
router.get ('/', productController.getAllProduct);
router.patch('/:id', multer, productController.editProduct);
router.delete('/:id', productController.deleteProduct, deleteImage(Product, 'imageUrl'));




module.exports = router;