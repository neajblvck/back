// PPRODUCTS ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const productController = require('../controller/product');



// Route pour créer un nouveau produit
router.post('/', multer, productController.createProduct);

// Route pour récupérer un produit par son id
router.get ('/:id', productController.getOneProduct);

// Route pour récupérer tous les produits
router.get ('/', productController.getAllProduct);

// Route pour mettre à jour un produit existant
// router.put ('/:id', authMiddleware, multer, productController.editProduct);

// Route pour mettre à jour un produit existant de façon incomplète
router.patch('/:id', multer, productController.editProduct);

// Route pour supprimer un produit existant
router.delete('/:id', productController.deleteProduct);
 
module.exports = router;