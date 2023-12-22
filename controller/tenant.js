const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Tenant = require('../models/tenant');
const UserModel = require('../models/user');
const stripeService = require('../service/stripeService.js');

exports.registerTenant = async (req, res) => {
    const accountDetails = req.body;
    let stripeCustomerId;
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Étape 1 : Création du Tenant
        const newTenant = new Tenant(accountDetails);
        await newTenant.save({ session });

        // Étape 2 : Création de l'Utilisateur Administrateur 
        const hashedPassword = await bcrypt.hash(accountDetails.password, 10);
        const adminUser = new UserModel({
            name: accountDetails.name,
            surname: accountDetails.surname,
            phone: accountDetails.phone,
            email: accountDetails.email,
            password: hashedPassword,
            tenantId: newTenant._id,
            permissions: 'admin',
            // autres champs si nécessaire
        });
        
        await adminUser.save({ session });

        // Étape 3 : Création du Client Stripe
        const stripeCustomer = await stripeService.createCustomer(accountDetails, newTenant._id);
        stripeCustomerId = stripeCustomer.id;

        // Mise à jour du Tenant avec le Stripe CustomerId
        newTenant.stripeCustomerId = stripeCustomerId;
        await newTenant.save({ session });

        await session.commitTransaction();
        return res.status(200).json(newTenant);
    } catch (error) {
        await session.abortTransaction();
        console.error("Erreur durant l'enregistrement du tenant:", error);
        return res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};



        // Étape 4 : Création Dynamique de la Collection pour le Tenant
        // const collectionName = `tenant_${newTenant._id}_data`;
        // const db = mongoose.connection;
        // const initialData = { message: "Initialisation de la collection" };
        // await db.collection(collectionName).insertOne(initialData);


// exports.registerTenant = async (req, res) => {
//     const accountDetails = req.body;
//     let stripeCustomerId;
//     const session = await mongoose.startSession();

//     try {
//         await session.startTransaction();

//         // Étape 1 : Création du Client Stripe
//         try {
//             const stripeCustomer = await stripeService.createCustomer(accountDetails);
//             stripeCustomerId = stripeCustomer.id;
//         } catch (error) {
//             console.error("Erreur lors de la création du client Stripe:", error);
//             throw error; // Propager l'erreur
//         }

//         // Étape 2 : Création du Tenant
//         const newTenant = new Tenant({ ...accountDetails, stripeCustomerId });
//         await newTenant.save({ session });

//         // Étape 3 : Création de l'Utilisateur Administrateur
//         // Exemple simplifié - adapter selon votre logique d'application
//         // const adminDetails = {  };
//         // const newAdmin = new User({ ...adminDetails, tenant: newTenant._id });
//         // await newAdmin.save({ session });

//         await session.commitTransaction();
//         return res.status(200).json(newTenant);
//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Erreur durant l'enregistrement du tenant:", error);
//         return res.status(500).json({ error: error.message });
//     } finally {
//         session.endSession();
//     }
// };




exports.updateTenant = async (req, res) => {
    const tenantId = req.params.tenantId;
    const updateData = req.body;

    try {
        const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, updateData, { new: true, runValidators: true });

        if (!updatedTenant) {
            return res.status(404).json({ message: 'Tenant non trouvé' });
        }

        res.status(200).json({
            message: 'Tenant mis à jour avec succès',
            tenant: updatedTenant
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du tenant', error: error.message });
    }
};


