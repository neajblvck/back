const OrderDAO = require('../dao/orderDAO');

// Controllers pour les différents types d'événements Stripe

const handlePaymentIntentSucceeded = async (paymentIntent) => {
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
        const updateOrder = await orderDAO.updateOrderByPi(paymentIntent.id, orderData);
        
        console.log(`Paiement réussi pour la commande ${updateOrder}`);
    } catch (error) {
        console.error(`Erreur dans handlePaymentIntentSucceeded: ${error.message}`);
        // Gestion des erreurs supplémentaires si nécessaire
    }
};

const handlePaymentIntentFailed = (paymentIntent) => {
    // Logique pour gérer un paiement échoué
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
