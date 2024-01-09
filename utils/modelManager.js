// modelManager.js
const mongoose = require('mongoose');

class ModelManager {
    constructor() {
        this.models = {};
    }

    getModelForTenant(tenantId, schema, modelName, collectionPrefix) {
        const modelKey = `${modelName}_${tenantId}`;
        const collectionName = `tenant_${tenantId}_${collectionPrefix}`;        
        if (!this.models[modelKey] && tenantId) {
            this.models[modelKey] = mongoose.model(modelKey, schema, collectionName);
            // console.log(`MODELMANAGER ==> Modèle créé : ${modelKey}`);
        }

        return this.models[modelKey];
    }

}

module.exports = new ModelManager();
