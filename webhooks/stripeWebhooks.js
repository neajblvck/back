const stripeWebhooksController = require('../controller/stripeWebhooks.js');


// CONSEIL: webhook à écouter = terminal.reader.action_succeeded, terminal_reader_timeout



module.exports = (req, res) => {
    const event = req.event;
    console.log(req)
    
    switch (event.type) {
        case 'payment_intent.succeeded':
            stripeWebhooksController.handlePaymentIntentSucceeded(event.data.object);
            break;
        case 'payment_intent.payment_failed':
            stripeWebhooksController.handlePaymentIntentFailed(event.data.object);
            break;
        case 'terminal.reader.action_updated':
            stripeWebhooksController.handlePaymentIntentRequiresAction(event.data.object);
            break;
        // ...
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send({ received: true });
};