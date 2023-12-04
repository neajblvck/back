const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const printController = require('../controller/printController');

// Définir la route pour l'impression
router.post('/', printController.printOrder);

module.exports = router;
