// stripeController.js
const stripeService = require('../service/stripeService.js');
const stripe = require('stripe')('sk_test_51NYJ6hGzmWR6qGMpLclDToxuhDCRCUgxIOdOWVXXYu1NpltqCLlyPgCaN9IrMRuvOgCzorJlY5gmaBDKgBZ6tBJ1001Rld5pVT');

const stripeController = {
    createExpressAccount: (req, res) => {
        // Décomposer les détails de l'utilisateur
        const { country, email } = req.body;
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


    createTerminalPaymentIntent: (req, res) => {
        const { accountId } = req.params;
        // Décomposer les détails du paiement
        const {amount, currency } = req.body;
        stripeService.createTerminalPaymentIntent(accountId, amount, currency)
            .then(paymentIntent => res.status(200).json(paymentIntent))
            .catch(error => res.status(500).send(error.message));
    },

    processPayment: (req, res) => {
        const { accountId } = req.params;
        // Décomposer les détails du paiement
        const tmr = 'tmr_FXSHmgcmlJk0sK';
        stripeService.processPayment(accountId, tmr)
            .then(response => res.status(200).json(response))
            .catch(error => res.status(500).send(error.message));
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