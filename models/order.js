const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    accountId: {
        type: String, // Référence au modèle Client
        required: true
    },
    // orderItems: [{
    //     productId: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         required: true
    //     },
    //     quantity: {
    //         type: Number,
    //         required: true,
    //         min: 1
    //     },
    //     price: {
    //         type: Number,
    //         required: true
    //     }
    // }],
    paymentIntent: {
        stripePaymentIntentId: String, 
        stripeApplication: String,
        status: String, 
        canceledAt: String,
        cancellationReason: String,
        paymentMethodType: String,

    },
    amount: {
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
