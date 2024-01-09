const mongoose = require('mongoose');
const modelManager = require('../utils/modelManager');
const OptionSchema = require('../models/option');

class optionDAO {
    constructor(tenantId) {
        this.tenantId = tenantId;
        const modelName = 'Option'
        const collectionName = 'options'
        const schema = OptionSchema
        this.OptionModel = modelManager.getModelForTenant(this.tenantId, schema, modelName, collectionName);

    }

    async createOption(optionData, options) {
        const newOption = new this.OptionModel(optionData)
        return await newOption.save(options);
    }

    async getAllOptions() {
        // const productModelName = `Product_${this.tenantId}`;
        try {
            return await this.OptionModel.find()
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
            return await this.OptionModel.findOne({ _id: productId })
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

    async findByIdAndUpdate(optionId, optionData, options) {
        try {

            const updatedProduct = await this.OptionModel.updateOne(
                { _id: optionId },
                { $set: optionData },
                options
            );
            return updatedProduct;
        } catch (error) {
            // Gestion des erreurs
            throw new Error(`Erreur lors de la mise à jour de l'option : ${error.message}`);
        }
    }
    // async updateProduct(productId, optionData) {
    //     try {

    //         const updatedProduct = await this.OptionModel.updateOne(
    //             { _id: productId },
    //             { $set: optionData },
    //             // { new: true } // Renvoie le document mis à jour
    //         );
    //         return updatedProduct;
    //     } catch (error) {
    //         // Gestion des erreurs
    //         throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
    //     }
    // }

    async updateManyProduct(productId, optionData, options) {
        try {

            const updatedProduct = await this.OptionModel.updateMany(
                {_id: productId},
                optionData,
                options
            );
            return updatedProduct;
        } catch (error) {
            // Gestion des erreurs
            throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
        }
    }

    async deleteOption(optionId) {
        return await this.OptionModel.deleteOne({ _id: optionId });
    }

}


module.exports = optionDAO;
