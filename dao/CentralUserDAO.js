const bcrypt = require('bcrypt');
const CentralUser = require('../models/user'); // Modèle pour la collection centralisée des utilisateurs

class CentralUserDAO {
    // Créer un nouvel utilisateur
    async createUser(userData) {
        const newUser = new CentralUser(userData);
        await newUser.save();
        return newUser;
    }

    // Trouver un utilisateur par email
    async findUserByEmail(email) {
        return await CentralUser.findOne({ email });
    }

    // Trouver un utilisateur par ID
    async findUserById(userId) {
        return await CentralUser.findById(userId);
    }

    // Mettre à jour un utilisateur
    async updateUserById(userId, updateData) {
        return await CentralUser.findByIdAndUpdate(userId, updateData, { new: true });
    }

    // Supprimer un utilisateur
    async deleteUserById(userId) {
        return await CentralUser.findByIdAndDelete(userId);
    }

    // Ajoutez d'autres méthodes si nécessaire...
}

module.exports = CentralUserDAO;
