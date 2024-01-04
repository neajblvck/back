const OrderDAO = require('../dao/orderDAO');

// Controllers pour les différents types d'événements Stripe

const handlePaymentIntentSucceeded = async (paymentIntent) => {
    try {
        const tenantId = paymentIntent.metadata.tenant
        const orderDAO = new OrderDAO(tenantId)
        const orderData = {
            paymentIntent: {
                status: paymentIntent.status, 
                canceledAt: paymentIntent.canceled_at,
                cancellationReason: paymentIntent.cancellation_reason,
                paymentMethodType: paymentIntent.payment_method,
            }
        }
        const updateOrder = await orderDAO.updateOrder(paymentIntent.id, orderData);
        console.log(updateOrder)
        // Trouver et mettre à jour la commande correspondante dans la base de données
        // const order = await Order.findById(orderId);
        // if (!order) {
        //     throw new Error(`Commande avec ID ${orderId} non trouvée.`);
        // }

        // order.status = 'paid'; // Mettre à jour le statut de la commande
        // await order.save();

        // Effectuer d'autres actions, comme envoyer un email de confirmation
        // sendConfirmationEmail(order); // Imaginons une fonction pour envoyer un email

        console.log(`Paiement réussi pour la commande ${orderId}`);
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
