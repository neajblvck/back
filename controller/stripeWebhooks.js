const OrderDAO = require('../dao/orderDAO');
const printService = require('../service/printService');

// Controllers pour les différents types d'événements Stripe

const handlePaymentIntentSucceeded = async (req, paymentIntent) => {
    try {
        const tenantId = paymentIntent.metadata.tenant
        const idSSE = paymentIntent.metadata.idSSE
        
        const orderData = {
            paymentIntent: {
                status: paymentIntent.status, 
                canceledAt: paymentIntent.canceled_at,
                cancellationReason: paymentIntent.cancellation_reason,
                paymentMethodType: paymentIntent.payment_method,
            }
        }



        const orderDAO = new OrderDAO(tenantId)

        const orderDataFromDB = await orderDAO.findOrderByPi(paymentIntent.id)
        await orderDAO.updateOrderByPi(paymentIntent.id, orderData, {new:true});


        const printConfig = {
            connectionType: 'Network',
            printerIP: '192.168.1.89'
        }
        const ticketData = orderDataFromDB.ticketData

        // renvoit un le status validé du paiement au client (via son SSE)
        const sseManager = req.app.get('sseManager');
        if (idSSE) {
            // Envoi d'une notification SSE au client spécifique
            sseManager.unicast(idSSE, {
              id: Date.now(),
              type: 'payment-update',
              ticketData: orderDataFromDB.ticketData,
              printerIP: printConfig.printerIP,
              data: { status: 'succeeded', message: 'Votre paiement a été validé.' }
            });
          }

        // await printService.printOrder(printConfig, ticketData);

    } catch (error) {
        console.error(`Erreur dans handlePaymentIntentSucceeded: ${error.message}`);
        // Gestion des erreurs supplémentaires si nécessaire
    }
};

const handlePaymentIntentFailed = async (paymentIntent) => {
    try {
        const tenantId = paymentIntent.metadata.tenant
        
        const orderData = {
            paymentIntent: {
                status: paymentIntent.status, 
                canceledAt: paymentIntent.canceled_at,
                cancellationReason: paymentIntent.cancellation_reason,
                paymentMethodType: paymentIntent.payment_method,
            }
        }


        const orderDAO = new OrderDAO(tenantId)
        const updateOrder = await orderDAO.updateOrderByPi(paymentIntent.id, orderData, {new:true});

    } catch (error) {
        console.error(`Erreur dans handlePaymentIntentSucceeded: ${error.message}`);
        // Gestion des erreurs supplémentaires si nécessaire
    }
};

const handlePaymentIntentRequiresAction = (paymentIntent) => {
    // Logique pour gérer un paiement nécessitant une action supplémentaire
};

// Ajoutez d'autres gestionnaires d'événements au besoin

module.exports = {
    handlePaymentIntentSucceeded,
    handlePaymentIntentFailed,
    handlePaymentIntentRequiresAction
    // Exportez d'autres gestionnaires ici
};
