const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tenant = require('../models/tenant');

const subscriptionMiddleware = async (req, res, next) => {
    try {
        const tenantId = req.auth.tenantId; // Assurez-vous que le tenantId est défini dans l'authentification
        
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).json({ message: "Tenant non trouvé" });
        }

        // Vérifiez si le tenant a un stripeCustomerId et un stripeSubscriptionId
        if (!tenant.stripeCustomerId || !tenant.stripeSubscriptionId) {
            return res.status(403).json({ message: "Aucun abonnement Stripe actif trouvé" });
        }

        // Récupérer les détails de l'abonnement depuis Stripe
        const subscription = await stripe.subscriptions.retrieve(tenant.stripeSubscriptionId);

        // Vérifiez le statut de l'abonnement
        if (subscription.status !== 'active' && subscription.status !== 'trialing') {
            return res.status(403).json({ message: "Votre abonnement Stripe n'est pas actif" });
        }

        next(); // Continue vers la route suivante si tout est en ordre
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la vérification de l'abonnement Stripe", error: error });
    }
};

module.exports = subscriptionMiddleware;
