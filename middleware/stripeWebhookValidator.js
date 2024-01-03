const endpointSecret = process.env.STRIPE_ENDPOINT
const stripe = process.env.STRIPE_API_KEY


module.exports = (request, response, next) => {
    try {
        request.event = stripe.webhooks.constructEvent(request.body, request.headers['stripe-signature'], endpointSecret);
        next();
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
};