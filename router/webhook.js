// STRIPE ROUTER.js


const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripe.js');
const authMiddleware = require('../middleware/auth');



router.post('/create-express-account', stripeController.createExpressAccount);
router.get('/create-onboarding-link/:accountId', stripeController.createOnboardingLink);
router.post('/create-location/:accountId', stripeController.createLocation);
router.post('/register-terminal-reader/:accountId', stripeController.registerTerminalReader);
router.get('/create-connection-token/:accountId', stripeController.createConnectionToken);
router.post('/create-terminal-payment-intent/:accountId', stripeController.createTerminalPaymentIntent);
router.post('/send-terminal-payment/:accountId', stripeController.sendPaymentIntentTerminal);
router.post('/capture-payment-intent', stripeController.capturePaymentIntent);
router.get('/process-payment/:accountId', stripeController.processPayment);
router.post('/create-customer/:accountId', stripeController.createCustomer);
router.post('/subscribe/:planId', authMiddleware, stripeController.subscribe);


module.exports = router;
