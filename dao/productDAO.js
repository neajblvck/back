const mongoose = require('mongoose');
const modelManager = require('../models/modelManager');
const dynamicProductSchema = require('../models/dynamicProduct');
const dynamiCategorySchema = require('../models/dynamicCategory');

class productDAO {
    constructor(tenantId) {
        this.tenantId = tenantId;
        const modelName = 'Product'
        const collectionName = 'products'
        const schema = dynamicProductSchema(this.tenantId)
        this.ProductModel = modelManager.getModelForTenant(this.tenantId, schema, modelName, collectionName);

    }

    async createProduct(productData, options) {
        const newProduct = new this.ProductModel(productData, options);
        return await newProduct.save();
    }

    async getAllProducts() {
        // const productModelName = `Product_${this.tenantId}`;
        try {
            return await this.ProductModel.find()
            // .sort('orderCategory')
            // .populate({
            //     path: 'products',
            //     model: productModelName 
            // });
        } catch (error) {
            // Gérer l'erreur spécifiquement
            if (!mongoose.modelNames().includes(productModelName)) {
                return await this.CategoryModel.find().sort('orderCategory')
            }
            throw error;
        }
    }

    async findProduct(productId) {
        // const productModelName = `Product_${this.tenantId}`;

        try {
            return await this.ProductModel.findOne({ _id: productId })
            // .populate({
            //     path: 'products',
            //     model: productModelName
            // });
        } catch (error) {
            // Gérer l'erreur spécifiquement
            if (!mongoose.modelNames().includes(productModelName)) {
                return await this.CategoryModel.findOne({ _id: categoryId });
            }
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {

            const updatedProduct = await this.ProductModel.updateOne(
                { _id: productId },
                { $set: productData },
                // { new: true } // Renvoie le document mis à jour
            );
            return updatedProduct;
        } catch (error) {
            // Gestion des erreurs
            throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
        }
    }

    async updateManyProduct(productId, productData, options) {
        try {

            const updatedProduct = await this.ProductModel.updateMany(
                productId,
                productData,
                options
            );
            return updatedProduct;
        } catch (error) {
            // Gestion des erreurs
            throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
        }
    }

    async removeOptionFromProducts(optionId) {
        console.log('dao removeOptionFromProduct')
        await this.ProductModel.updateMany(
            { option: optionId },
            { $pull: { option: optionId } }
        )
    }

    async deleteProduct(productId) {
        const CategoryModel = modelManager.getModelForTenant(this.tenantId, dynamiCategorySchema(this.tenantId), 'Category', 'categories');
        await CategoryModel.updateMany(
            { products: productId },
            { $pull: { products: productId } }
          );
        return await this.ProductModel.deleteOne({ _id: productId });
    }

}


module.exports = productDAO;
