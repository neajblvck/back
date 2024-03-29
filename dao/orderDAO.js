const mongoose = require('mongoose');
const modelManager = require('../utils/modelManager');
const OrderSchema = require('../models/order');

class orderDAO {
    constructor(tenantId) {
        this.tenantId = tenantId;
        const modelName = 'Order'
        const collectionName = 'orders'
        const schema = OrderSchema
        this.OrderModel = modelManager.getModelForTenant(this.tenantId, schema, modelName, collectionName);

    }

    async saveOrder(orderData) {
        const newOrder = new this.OrderModel(orderData);
        return await newOrder.save();
    }

    // path: 'products', // Peuple d'abord les produits
    // populate: {
    //     path: 'options', // Ensuite, peuple les options de chaque produit
    //     model: 'Options', 
    //     populate: {
    //         path: 'choices.choiceItem', // Peuple les choix de type Product
    //         model: 'Product', 
    //         // match: { choiceType: 'Product' } // Condition pour peupler seulement si le type est 'Product'
    //     }

    async getAllCategories() {
        try {
            // Premier essai de récupération et peuplement des catégories
            return await this.CategoryModel.find()
                .sort('orderCategory')
                .populate({
                    path: 'products',
                    populate: {
                        path: 'options',
                        model: `Option_${this.tenantId}`,
                        populate: {
                            path: 'choices.choiceItem',
                            model: `Product_${this.tenantId}`,
                            // match: { choiceType: 'Product' }
                        }
                    }
                })
        } catch (error) {
            try {
                console.log('err getAllcat:', error)
            // Recréation des modèles manquants
            await modelManager.getModelForTenant(this.tenantId, dynamicProductSchema(this.tenantId), 'Product', 'products');
            await modelManager.getModelForTenant(this.tenantId, OptionSchema, 'Option', 'options');
                // Second essai après création des modèles
                return await this.CategoryModel.find()
                .sort('orderCategory')
                .populate({
                    path: 'products',
                    populate: {
                        path: 'options',
                        model: `Option_${this.tenantId}`,
                        populate: {
                            path: 'choices.choiceItem',
                            model: `Product_${this.tenantId}`,
                            // match: { choiceType: 'Product' }
                        }
                    }
                })
            } catch (secondError) {
                console.error('Erreur lors du getAllCategory:', secondError);
                throw secondError;
            }
        }
    }
    async findOrderByPi(pi) {
        try {
            return await this.OrderModel.findOne({ paymentIntentId: pi })
        } catch (error) {
            // Gérer l'erreur spécifiquement
            console.log(error)
            throw error;
        }
    }

    async updateOrderByPi(pi, orderData, options) {
        try {
            // Ajoutez 'new: true' pour obtenir le document mis à jour
    
            const updatedOrder = await this.OrderModel.findOneAndUpdate(
                { paymentIntentId: pi },
                { $set: orderData },
                options
            );
    
            if (!updatedOrder) {
                throw new Error(`Aucune commande trouvée avec l'ID de PaymentIntent ${pi}`);
            }
    
            return updatedOrder;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la commande: ${error.message}`);
        }
    }

    async removeProductFromCategories(productId) {
        await this.CategoryModel.updateMany(
            { products: productId },
            { $pull: { products: productId } }
        )
    }

    async deleteCategory(categoryId) {
        return await this.CategoryModel.deleteOne({ _id: categoryId });
    }

}

module.exports = orderDAO;