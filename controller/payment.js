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
    const currency = tenant.stripeCurrency || 'eur'

    const paymentIntent = await stripeService.createTerminalPaymentIntent(tenantId, accountId, amount, currency);
    const paymentStatus = await stripeService.processPayment(accountId, tmr, paymentIntent.id);
    
    res.status(200).json({
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentStatus.status
    })

    } catch(error){
        res.status(500).json({ error });
        console.log(error)
    }


};

// annuler payment Intent
exports.cancelPaymentIntent = async (req, res) => {
    const reader = await stripe.terminal.readers.cancelAction('tmr_xxx');
}