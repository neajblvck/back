// STRIPE ROUTER.js


const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripe.js');


router.post('/create-express-account', stripeController.createExpressAccount);
router.get('/create-onboarding-link/:accountId', stripeController.createOnboardingLink);
router.post('/create-location/:accountId', stripeController.createLocation);
router.post('/register-terminal-reader/:accountId', stripeController.registerTerminalReader);
router.get('/create-connection-token/:accountId', stripeController.createConnectionToken);
router.post('/create-terminal-payment-intent/:accountId', stripeController.createTerminalPaymentIntent);
router.post('/capture-payment-intent', stripeController.capturePaymentIntent);
router.get('/process-payment/:accountId', stripeController.processPayment);


module.exports = router;
