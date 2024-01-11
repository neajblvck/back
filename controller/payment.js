// stripeController.js
const stripeService = require('../service/stripeService.js');
const Tenant = require('../models/tenant'); ``
const ProductDAO = require('../dao/productDAO');
const OrderDAO = require('../dao/orderDAO');
const { calculTotalAmountFromDB } = require('../utils/shopCartUtils.js');

exports.createPaymentIntent = async (req, res) => {
    const tenantId = req.auth.tenantId

    const { shopCartData, orderType, idSSE } = req.body
    console.log('createPi controller:', idSSE)
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


    const paymentIntent = await stripeService.createTerminalPaymentIntent(tenantId, accountId, amount, currency, idSSE);
    const orderData = {
        accountId: accountId,
        amount: totalAmount,
        orderType: orderType,
        paymentIntentId: paymentIntent.id,
        paymentIntent:
        {
            application_fee_amount: paymentIntent.application_fee_amount,
            stripeApplication: paymentIntent.application,
            status: paymentIntent.status, 
        }
    }
    const orderDAO = new OrderDAO(tenantId)
    const newOrder = await orderDAO.saveOrder(orderData)

    const paymentStatus = await stripeService.processPayment(accountId, tmr, paymentIntent.id, currency)
    
    res.status(200).json({
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentStatus.status
    })

    } catch(error){
        res.status(500).json({error});
        console.log(error)
    }


};

// annuler payment Intent
exports.cancelPaymentIntent = async (req, res) => {
    const reader = await stripe.terminal.readers.cancelAction('tmr_xxx');
}