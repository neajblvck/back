const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    accountId: {
        type: String, 
        required: true
    },
    paymentIntentId: String,
    paymentIntent: {
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
});

module.exports = OrderSchema;
