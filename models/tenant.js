const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dbConnectionString: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, trim: true },
        postal_code: { type: String, trim: true },
        state: { type: String, trim: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stripeCustomerId: String,
    stripeAccountId: String,
    stripeTmr: String,
    stripeTml: String,
    stripeSubscriptionId: String,
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'pending'], 
        default: 'inactive'
      }
});

module.exports = mongoose.model('Tenant', tenantSchema);
