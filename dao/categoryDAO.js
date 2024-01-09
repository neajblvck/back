const mongoose = require('mongoose');
const modelManager = require('../utils/modelManager');
const dynamicCategorySchema = require('../models/dynamicCategory');
const OptionSchema = require('../models/option');
const dynamicProductSchema = require('../models/dynamicProduct');

class categoryDAO {
    constructor(tenantId) {
        this.tenantId = tenantId;
        const modelName = 'Category'
        const collectionName = 'categories'
        const schema = dynamicCategorySchema(this.tenantId)
        this.CategoryModel = modelManager.getModelForTenant(this.tenantId, schema, modelName, collectionName);

    }

    async createCategory(categoryData) {
        const newCategory = new this.CategoryModel(categoryData);
        return await newCategory.save();
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
    async findCategory(categoryId) {
        const productModelName = `Product_${this.tenantId}`;

        try {
            return await this.CategoryModel.findOne({ _id: categoryId })
                .populate({
                    path: 'products',
                    model: productModelName // Assurez-vous que ce modèle est correctement enregistré
                });
        } catch (error) {
            // Gérer l'erreur spécifiquement
            if (!mongoose.modelNames().includes(productModelName)) {
                return await this.CategoryModel.findOne({ _id: categoryId });
            }
            throw error;
        }
    }
    async updateCategory(categoryId, categoryData, options) {
        try {
            const updatedCategory = await this.CategoryModel.updateOne(
                { _id: categoryId },
                categoryData,
                options
                // { new: true } 
            );
            return updatedCategory;
        } catch (error) {
            // Gestion des erreurs
            throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
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

module.exports = categoryDAO;
