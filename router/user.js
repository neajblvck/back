// ROUTER USER

const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');
const authMiddleware = require('../middleware/auth');

module.exports = (CentralUserDAO) => {
    const controller = userCtrl(CentralUserDAO);

    // Route pour la création d'un utilisateur
    router.post('/signup', controller.signup);
    
    // Route pour l'authentification d'un utilisateur
    router.post('/login',  controller.login);
    
    // Autres routes
    router.get('/', authMiddleware, controller.getAllUsers);
    router.get('/:id', authMiddleware, controller.getUser);
    router.patch('/:id', authMiddleware, controller.editUser);
    router.delete('/:id', authMiddleware, controller.deleteUser);

    return router;
};