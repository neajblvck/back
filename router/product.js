// PPRODUCTS ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const productController = require('../controller/product');

// Routes pour les Catégories
router.post('/categories', productController.createCategory); 
router.get('/categories', productController.getAllCategories);
router.put('/categories/:id', productController.updateCategory);
router.delete('/categories/:id', productController.deleteCategory);

router.put('/products/move', productController.moveProductsToCategory);
router.put('/products/copy', productController.copyProductsToCategory);
router.put('/products/remove', productController.removeProductFromCategory);

// Route PRODUIT
router.post('/', multer, productController.createProduct);
router.get ('/:id', productController.getOneProduct);
router.get ('/', productController.getAllProduct);
router.patch('/:id', multer, productController.editProduct);
router.delete('/:id', productController.deleteProduct);

// Route ordre OPTION
router.post('/options', productController.createOption);
router.delete('/options/:id', productController.deleteOption);
router.put('/options/:id/options-order', productController.updateOptionsOrder);





module.exports = router;