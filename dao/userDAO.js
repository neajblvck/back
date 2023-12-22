// const userModel = require('../models/user');

// class UserDAO {
//     constructor() {
       
//     }

//     async createUser(tenantId, userData) {
//         const collectionName = `tenant_${tenantId}_users`;
//         const user = new userModel({ ...userData, collectionName: collectionName });
//         await user.save();
//         return user;
//     }

//     async findUserById(tenantId, id) {
//         const collectionName = `tenant_${tenantId}_users`;
//         return await userModel.findOne({ _id: id, collectionName: collectionName });
//     }

//     async findUserByEmail(tenantId, email) {
//         const collectionName = `tenant_${tenantId}_users`;
//         return await userModel.findOne({ email: email, collectionName: collectionName });
//     }

//     async updateUserById(tenantId, id, updateData) {
//         const collectionName = `tenant_${tenantId}_users`;
//         return await userModel.updateOne({ _id: id, collectionName: collectionName }, updateData);
//     }

//     async deleteUserById(tenantId, id) {
//         const collectionName = `tenant_${tenantId}_users`;
//         return await userModel.deleteOne({ _id: id, collectionName: collectionName });
//     }

   
// }

// module.exports = UserDAO;


const mongoose = require('mongoose');
const UserSchema = require('../models/user') 

class UserDAO {
    constructor() {
        this.models = {};
    }

    getModelForTenant(tenantId) {
        if (!this.models[tenantId]) {
            const collectionName = `tenant_${tenantId}_users`;
            this.models[tenantId] = mongoose.model(`User_${tenantId}`, UserSchema, collectionName);
        }
        return this.models[tenantId];
    }

    async createUser(tenantId, userData) {
        const User = this.getModelForTenant(tenantId);
        const user = new User(userData);
        await user.save();
        return user;
    }

    async findUserById(tenantId, userId) {
        const User = this.getModelForTenant(tenantId);
        return await User.findById(userId);
    }

    async findUserByEmail(tenantId, email) {
        const User = this.getModelForTenant(tenantId);
        return await User.findOne({ email });
    }

    async updateUserById(tenantId, userId, updateData) {
        const User = this.getModelForTenant(tenantId);
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async deleteUserById(tenantId, userId) {
        const User = this.getModelForTenant(tenantId);
        return await User.findByIdAndDelete(userId);
    }

    // Ajoutez d'autres méthodes ici selon les besoins de votre application
}

module.exports = UserDAO;
