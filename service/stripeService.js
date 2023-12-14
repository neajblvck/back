const stripe = require('stripe')('sk_test_51NYJ6hGzmWR6qGMpLclDToxuhDCRCUgxIOdOWVXXYu1NpltqCLlyPgCaN9IrMRuvOgCzorJlY5gmaBDKgBZ6tBJ1001Rld5pVT');

const stripeService = {

    // Créer un compte Stripe Express
    createExpressAccount: (userDetails) => {
        return stripe.accounts.create({
            type: 'standard',
            country: userDetails.country,
            email: userDetails.email,
            // capabilities: {
            //     card_payments: { requested: true },
            //     transfers: { requested: true },
            // },
        });
    },

    // CREER UN CUSTOMER: Nouvel Utilisateur du Saas
    // https://stripe.com/docs/api/customers/object
//     const customer = await stripe.customers.create({
//     name: 'Jenny Rosen',
//     email: 'jennyrosen@example.com',
//   });

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
                registration_code: 'simulated-wpe',
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
    createTerminalPaymentIntent: (accountId, amount, currency) => {
        return stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            payment_method_types: ['card_present'],
            // on_behalf_of: accountId,
            // capture_method: 'automatic',
            // transfer_data: {
            //     destination: accountId, 
            //   },
            // application_fee_amount: 100,
          }, {
            stripeAccount: accountId
          });
    },

    
    processPayment: (accountId, tmr) => {
        return stripe.terminal.readers.processPaymentIntent(
            'tmr_FXSHmgcmlJk0sK',
        {
          payment_intent: 'pi_3OMMcw2emXQAcOi81KejCnMp',
        }
        , {
            stripeAccount: accountId
          }
      )},

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
