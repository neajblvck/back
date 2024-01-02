// stripeController.js
const stripeService = require('../service/stripeService.js');
const Tenant = require('../models/tenant'); ``
const mongoose = require('mongoose');
const ProductDAO = require('../dao/productDAO');
const { calculTotalAmountFromDB } = require('../utils/shopCartUtils.js');

exports.createPaymentIntent = async (req, res) => {
    const tenantId = req.auth.tenantId

    const { shopCartData, orderType } = req.body
    const productIds = shopCartData.map(item => item._id);
    const productDAO = new ProductDAO(tenantId);
    const productsFromDB = await productDAO.findManyProduct(productIds)

    try {
    const totalAmount = await calculTotalAmountFromDB(shopCartData, productsFromDB)
    const tenant = await Tenant.findById(tenantId)

    const amount = totalAmount*100
    const tmr = tenant.stripeTmr || 'tmr_FX8QTwhRuXzLuN';
    const accountId = tenant.stripeAccountId || 'acct_1OMHyO2emXQAcOi8';
    const currency = 'eur';

    stripeService.createTerminalPaymentIntent(accountId, amount, currency)
            .then(paymentIntent => {
                // Étape 2: Processus de Paiement avec le Payment Intent créé
                const pi = paymentIntent.id; // ID du Payment Intent
                return stripeService.processPayment(accountId, tmr, pi);
            })
            .then(response => {
                // Réponse du processus de paiement
                res.status(200).json(response);
            })
            .catch(error => {
                // Gestion des erreurs
                res.status(500).send(error.message);
            });

    } catch(error){
        res.status(500).json({ error });
        console.log(error)
    }


};

