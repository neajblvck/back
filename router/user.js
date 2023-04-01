// ROUTER USER

const express = require('express');
const router = express.Router();

const userCtrl = require('../controller/user');
const authMiddleware = require('../middleware/auth');

// Route pour création utilisateur
router.post('/signup', userCtrl.signup);
// Route pour authentification utilisateur
router.post('/login', userCtrl.login);
//
router.get('/', authMiddleware, userCtrl.getAllUsers);
router.get('/:id', authMiddleware, userCtrl.getUser);
router.post('/', authMiddleware, userCtrl.signup);
router.patch('/:id', authMiddleware, userCtrl.editUser);
router.delete('/:id', authMiddleware, userCtrl.deleteUser);

module.exports = router;