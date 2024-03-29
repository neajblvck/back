// stripeController.js
const stripeService = require('../service/stripeService.js');
const Tenant = require('../models/tenant'); ``
const ProductDAO = require('../dao/productDAO');
const OrderDAO = require('../dao/orderDAO');
const { calculTotalAmountFromDB } = require('../utils/shopCartUtils.js');
const printService = require('../service/printService');

exports.createPaymentIntent = async (req, res) => {
    const tenantId = req.auth.tenantId

    const { shopCartData, orderType, callbackID, idSSE } = req.body

    const productIds = shopCartData.map(item => item._id);
    const productDAO = new ProductDAO(tenantId);
    const productsFromDB = await productDAO.findManyProduct(productIds)


    try {
    const totalAmount = await calculTotalAmountFromDB(shopCartData, productsFromDB)
    const tenant = await Tenant.findById(tenantId)

    const amount = totalAmount
    const tmr = tenant.stripeTmr || 'tmr_FX8QTwhRuXzLuN';
    const accountId = tenant.stripeAccountId || 'acct_1OMHyO2emXQAcOi8';
    const currency = tenant.stripeCurrency || 'eur'


    const paymentIntent = await stripeService.createTerminalPaymentIntent(tenantId, accountId, amount, currency, idSSE);

    const orderData = {
        ticketData: {
            shopCartData,
            orderType,
            callbackID,
            totalAmount,
        },
        accountId: accountId,
        amount: amount,
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