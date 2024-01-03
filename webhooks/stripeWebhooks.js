const stripeWebhooksController = require('../controller/stripeWebhooks.js');

module.exports = (request, response) => {
    const event = request.event;
    
    switch (event.type) {
        case 'payment_intent.succeeded':
            stripeWebhooksController.handlePaymentIntentSucceeded(event.data.object);
            break;
        case 'payment_intent.payment_failed':
            stripeWebhooksController.handlePaymentIntentFailed(event.data.object);
            break;
        case 'payment_intent.requires_action':
            stripeWebhooksController.handlePaymentIntentRequiresAction(event.data.object);
            break;
        // ...
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.send({ received: true });
};