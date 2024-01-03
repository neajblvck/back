const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId, // Référence au modèle Client
        required: true
    },
    orderItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId, // Référence au modèle Produit
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
        // Ajoutez d'autres champs si nécessaire, comme les options de produit
    }],
    status: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentInfo: {
        stripePaymentIntentId: String, // ID du PaymentIntent de Stripe
        status: String, // Par exemple, 'succeeded', 'failed'
        // Autres informations de paiement si nécessaire
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
    // Autres champs pertinents comme l'adresse de livraison, les notes, etc.
});

module.exports = OrderSchema;
