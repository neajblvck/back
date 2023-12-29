// PPRODUCTS ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const deleteImage = require('../middleware/deleteImage');

const multer = require('../middleware/multer-config');
const categoryController = require('../controller/category');

// Routes pour les Catégories
router.post('/', authMiddleware, multer, categoryController.createCategory); 
router.get('/', authMiddleware, categoryController.getAllCategories);
router.put('/order', authMiddleware, categoryController.updateCategoryOrder);
router.put('/:id', authMiddleware, multer, categoryController.editCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);


router.post('/addToCategory/:id', authMiddleware, multer, categoryController.addProductToCategory); 

module.exports = router;