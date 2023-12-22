const mongoose = require('mongoose');
const ProductSchema = require('../models/product'); // Assurez-vous que c'est un schéma Mongoose

class ProductDAO {
    constructor() {
        this.models = {};
    }

    getModelForTenant(tenantId) {
        if (!this.models[tenantId]) {
            const collectionName = `tenant_${tenantId}_products`;
            this.models[tenantId] = mongoose.model(`Product_${tenantId}`, ProductSchema, collectionName);
        }
        return this.models[tenantId];
    }

    async createProduct(tenantId, productData) {
        const Product = this.getModelForTenant(tenantId);
        const product = new Product(productData);
        await product.save();
        return product;
    }

    async findProductById(tenantId, productId) {
        const Product = this.getModelForTenant(tenantId);
        return await Product.findById(productId);
    }

    async updateProductById(tenantId, productId, updateData) {
        const Product = this.getModelForTenant(tenantId);
        return await Product.findByIdAndUpdate(productId, updateData, { new: true });
    }

    async deleteProductById(tenantId, productId) {
        const Product = this.getModelForTenant(tenantId);
        return await Product.findByIdAndDelete(productId);
    }

    // Ajoutez d'autres méthodes selon les besoins de votre application, comme trouver des produits par catégorie, etc.
}

module.exports = ProductDAO;
