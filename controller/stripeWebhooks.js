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
        const updateOrder = await orderDAO.updateOrderByPi(paymentIntent.id, orderData, {new:true});


        const sseManager = req.app.get('sseManager');
        if (idSSE) {
            // Envoi d'une notification SSE au client spécifique
            sseManager.unicast(idSSE, {
              id: Date.now(),
              type: 'payment-update',
              data: { status: 'succeeded', message: 'Votre paiement a été validé.' }
            });
          }

        
        const printConfig = {
            connectionType: 'Network',
            printerIP: '192.168.1.37'
        }
        const ticketData = orderDataFromDB.ticketData
        await printService.printOrder(printConfig, ticketData);

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
