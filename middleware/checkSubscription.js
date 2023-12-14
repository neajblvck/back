const User = require('./path/to/user.model'); // Chemin vers votre modèle utilisateur

async function checkSubscription(req, res, next) {
    try {
        const userId = req.user.id; // Assurez-vous que l'ID utilisateur est défini (via authentification)
        const user = await User.findById(userId);

        if (user && user.subscriptionStatus === 'active') {
            next(); // L'utilisateur a un abonnement actif
        } else {
            res.status(403).json({ message: 'Accès refusé : abonnement non actif' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification de l\'abonnement' });
    }
}
