// stripeController.js
const stripeService = require('../service/stripeService.js');
const Tenant = require('../models/tenant');


const stripeController = {

    createCustomer: (req, res) => {
        const customerDetails = req.body;
    
        stripeService.createCustomer(customerDetails)
        .then(customer => res.status(200).json(customer))
        .catch(error => res.status(500).send(error.message))

    },
    
    subscribe : async (req, res) => {
        const planId = req.params.planId;
        console.log(planId)
    
        try {
            const tenantId = req.auth.tenantId;
            const tenant = await Tenant.findById(tenantId);
    
            if (!tenant || !tenant.stripeCustomerId) {
                return res.status(404).json({ message: "Tenant ou Customer Stripe non trouvé" });
            }
    
            const stripeCustomerId = tenant.stripeCustomerId;
            console.log(stripeCustomerId)
    
            try {
                const response = await stripeService.subscribe({ planId, stripeCustomerId });
                res.status(200).json(response);
            } catch (error) {
                console.error("Erreur lors de la création de l'abonnement Stripe:", error);
                res.status(500).send(error.message);
            }
    
        } catch (error) {
            console.error("Erreur lors de la récupération du Tenant:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },



    createExpressAccount: (req, res) => {
        // Décomposer les détails de l'utilisateur
        const { country, email } = req.body;
        console.log(country, email)
        stripeService.createExpressAccount({ country, email })
            .then(account => res.status(200).json(account.id))
            .catch(error => res.status(500).send(error.message));
    },

    createOnboardingLink: (req, res) => {
        // Utiliser l'ID du compte directement des paramètres de la route
        const { accountId } = req.params;
        // const refreshUrl = encodeURIComponent('HTTP://localhost:8080');
        // const returnUrl = encodeURIComponent('HTTP://localhost:8080/menu');
        const refreshUrl = 'HTTP://localhost:8080';
        const returnUrl = 'HTTP://localhost:8080/menu';
        
        stripeService.createOnboardingLink(accountId, refreshUrl, returnUrl)
            .then(onboardingLink => res.status(200).json({ url: onboardingLink }))
            .catch(error => res.status(500).send(error.message));
    },


    createLocation: (req, res) => {
        const { accountId } = req.params;
        const  displayName  = req.body.displayName
        stripeService.createLocation(accountId, displayName)
            .then(location => res.status(200).json(location))
            .catch(error => res.status(500).send(error.message));
    },
    
    registerTerminalReader: (req, res) => {
        const { accountId } = req.params;
        
        // Décomposer les détails du lecteur
        let { registrationCode, locationId } = req.body;

        registrationCode = 'parler-nettoyeur-amusant';
        locationId = 'tml_FX8N3AFTbS3BA0';
        stripeService.registerTerminalReader(accountId, registrationCode, locationId)
            .then(reader => res.status(200).json(reader))
            .catch(error => res.status(500).send(error.message));
    },

    createConnectionToken: (req, res) => {
        const { accountId } = req.params;
        const locationId = req.body.locationId
        stripeService.createConnectionToken(accountId, locationId)
        .then(token => res.status(200).json(token))
        .catch(error => res.status(500).send(error.message));
    },

    // const tmr = 'tmr_FX8QTwhRuXzLuN';
    // const pi ='pi_3OPN5s2emXQAcOi81Ap5qeTt'

    createTerminalPaymentIntent: (req, res) => {
        const { accountId } = req.params;
        // Décomposer les détails du paiement
        const {amount} = req.body;
        const currency = 'eur'
        stripeService.createTerminalPaymentIntent(accountId, amount, currency)
            .then(paymentIntent => res.status(200).json(paymentIntent))
            .catch(error => res.status(500).send(error.message));
    },

    processPayment: (req, res) => {
        
        const { accountId } = req.params;
        // Décomposer les détails du paiement
        stripeService.processPayment(accountId, tmr, pi)
            .then(response => res.status(200).json(response))
            .catch(error => res.status(500).send(error.message));
    },

    sendPaymentIntentTerminal: (req, res) => {
        const { accountId } = req.params; 
        const { amount } = req.body; 
        const tmr = 'tmr_FX8QTwhRuXzLuN';
        const currency = 'eur';
    
        // Étape 1: Créer un Payment Intent
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
    },
    

    capturePaymentIntent: (req, res) => {
        // Décomposer les détails pour la capture du PaymentIntent
        const { paymentIntentId, accountId } = req.body;
        stripeService.capturePaymentIntent(paymentIntentId, accountId)
            .then(capturedIntent => res.status(200).json(capturedIntent))
            .catch(error => res.status(500).send(error.message));
    },

}


    
    module.exports = stripeController;



    //   "tml_FXSlngGe8G7nWU"


            // Enregistrer un lecteur Stripe Terminal pour un compte connecté


            // tmr_FXSmtQA5WBmtKp

            //pi_3OMNns2emXQAcOi80iog969W