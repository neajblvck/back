// STRIPE ROUTER.js


const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.js');
const authMiddleware = require('../middleware/auth');



router.post('/', authMiddleware, paymentController.createPaymentIntent);


module.exports = router;