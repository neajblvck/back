const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const stripeService = {


    // CREER UN CUSTOMER: Nouvel Utilisateur du Saas
    // https://stripe.com/docs/api/customers/object
    createCustomer: (accountDetails, tenantId) => {
        return stripe.customers.create({
            // name: accountDetails.name,
            email: accountDetails.email,
            payment_method: 'pm_card_visa',
            invoice_settings: {
              default_payment_method: 'pm_card_visa',
            },
            metadata: { tenant: tenantId },
            address: {
                line1: accountDetails.address.line1,
                line2: accountDetails.address.line2,
                city: accountDetails.address.city,
                postal_code: accountDetails.address.zip,
                state: accountDetails.address.state
            },
            description: accountDetails.description,
            phone: accountDetails.phone,

        })
        // , {
        //     stripeAccount: accountId,
        // });
    },

    subscribe: async ({ planId, stripeCustomerId }) => {

            const subscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [{ plan: planId }],
                // Autres options d'abonnement si nécessaire
            });

            return subscription;
    },

    // Créer un compte Stripe Express
    createExpressAccount: (userDetails) => {
        return stripe.accounts.create({
            type: 'express',
            country: userDetails.country,
            email: userDetails.email,
            // capabilities: {
            //     card_payments: { requested: true },
            //     transfers: { requested: true },
            // },
        });
    },

    // Créer un lien d'onboarding pour le compte Express
    createOnboardingLink: (accountId, refreshUrl, returnUrl) => {

        return stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
        });
    },



    createLocation: (accountId, displayName, adress) => {
        return stripe.terminal.locations.create({
            display_name: displayName,
            address: {
                line1: '19 Rue de Vienne',
                city: 'Paris',
                country: 'FR',
                postal_code: '75008',
            }
        }, {
            stripeAccount: accountId,
        });
    },


    // Enregistrer un lecteur Stripe Terminal pour un compte connecté
    registerTerminalReader: (accountId, registrationCode, locationId) => {

        return stripe.terminal.readers.create({
            registration_code: registrationCode,
            location: locationId,
            metadata: {
                connected_account_id: accountId // lié le reader au compte connecté
            }
        }, {
            stripeAccount: accountId,
        });
    },

    // création Token de connexion pour ouvrir une session
    createConnectionToken: (accountId, locationId) => {
        return stripe.terminal.connectionTokens.create({
            location: "tml_FXRwgAsPu2sEg1"
        }, {
            stripeAccount: accountId
        });
    },

    // Créer un PaymentIntent pour Stripe Terminal
    createTerminalPaymentIntent: (tenantId, accountId, amount, currency) => {
        return stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card_present'],
            capture_method: 'automatic',
            application_fee_amount: 123,
            metadata: {
                connected_account_id: accountId,
                tenant: tenantId,
            }
        }, {
            stripeAccount: accountId
        });
    },


    processPayment: (accountId, tmr, pi) => {  
        return stripe.terminal.readers.processPaymentIntent(
            tmr,
            {
            payment_intent: pi,
        }, {
            stripeAccount: accountId 
        });
    },

    // const reader = await stripe.terminal.readers.setReaderDisplay(
        // tmr,
        // {
        //   type: 'cart',
        //   cart: {
        //     line_items: [
        //       {
        //         description: 'Caramel latte',
        //         amount: 659,
        //         quantity: 1,
        //       },
        //       {
        //         description: 'Dozen donuts',
        //         amount: 1239,
        //         quantity: 1,
        //       },
        //     ],
        //     currency: 'eur',
        //     tax: 100,
        //     total: 1390,
        //   },
        // }
    //   );},

    cancelPaymentIntent: (pi) => {
        return stripe.paymentIntents.cancel(pi);
    },

    // Capturer un PaymentIntent après un paiement réussi via Stripe Terminal
    capturePaymentIntent: (paymentIntentId, accountId) => {
        return stripe.paymentIntents.capture(paymentIntentId, {}, {
            stripeAccount: accountId,
        });
    },
};


// const subscription = await stripe.subscriptions.create(
//     {
//       customer: '{{CUSTOMER_ID}}',
//       items: [
//         {
//           price: '{{PRICE_ID}}',
//         },
//       ],
//       expand: ['latest_invoice.payment_intent'],
//     },
//     {
//       stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
//     }
//   );




module.exports = stripeService;
