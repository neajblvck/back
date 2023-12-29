// CATEGORY CONTROLLER
const mongoose = require('mongoose');
const fs = require('fs');

const OptionDAO = require('../dao/optionDAO');
const ProductDAO = require('../dao/productDAO');

exports.createOption = async (req, res) => {
    const tenantId = req.auth.tenantId

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const optionData = {...req.body}

        // Validation des données
        if (!optionData.name || !optionData.choiceType) {
            throw new Error("Nom de l'option et type de choix sont requis.");
        }

        if (optionData.choiceType === 'CustomChoice' && !Array.isArray(optionData.customChoices)) {
            throw new Error("Les choix personnalisés doivent être un tableau.");
        }

        if (optionData.choiceType === 'Product' && !Array.isArray(optionData.productChoices)) {
            throw new Error("Les choix de produit doivent être un tableau.");
        }

        const optionDAO = new OptionDAO(tenantId);
        const newOption = await optionDAO.createOption({
            ...optionData, 
            choices: optionData.choiceType === 'CustomChoice' ? optionData.customChoices : optionData.productChoices
        },{
            session
        })

        // Mise à jour des produits si productList est fourni
        if (Array.isArray(optionData.productList) && optionData.productList.length > 0) {
            const productDAO = new ProductDAO(tenantId);
            await productDAO.updateManyProduct(
                { _id: { $in: optionData.productList } },
                { $push: { options: newOption._id } },
                { session }
            );
        }

        // Confirmation de la transaction
        await session.commitTransaction();
        res.status(201).json({ message: 'Option créée avec succès', option: newOption });
    } catch (error) {
        console.log(error)
        // En cas d'erreur, annulation de la transaction
        await session.abortTransaction();
        res.status(500).json({ message: 'Erreur lors de la création de l\'option', error: error.message });
    } finally {
        // Fermeture de la session
        session.endSession();
    }
};

exports.getAllOptions = (req, res) => {
    const tenantId = req.auth.tenantId
    const optionDAO = new OptionDAO(tenantId);
    optionDAO.getAllOptions()
        .then(options => {
            res.json(options);
        })
        .catch(error => {
            res.status(500).send({ message: 'Erreur lors de la récupération des options' });
        });
};

exports.getCategoryById = (req, res) => {
    Category.findById(req.params.id).populate('products')
        .then(category => {
            if (!category) {
                return res.status(404).send({ message: 'Catégorie non trouvée' });
            }
            res.json(category);
        })
        .catch(error => {
            res.status(500).send({ message: 'Erreur lors de la récupération de la catégorie' });
        });
},

exports.editCategory = (req, res) => {
        const tenantId = req.auth.tenantId;
        const categoryId = req.params.id;

        let categoryData = {
            titleCategory: req.body.titleCategory,
            descriptionCategory: req.body.descriptionCategory,
            available: req.body.available
        };

        const categoryDAO = new CategoryDAO(tenantId);
        categoryDAO.findCategory(categoryId)
            .then((existingCategory) => {
                if (Object.keys(req.files).length > 0) {
                    // Mise à jour de l'URL de la nouvelle image
                    categoryData.imgCategory = `${req.protocol}://${req.get('host')}/images/${req.files['imgCategory'][0].filename}`;

                    // Suppression de l'ancienne image si elle existe
                    if (existingCategory.imgCategory) {
                        const filename = existingCategory.imgCategory.split('/images/')[1];
                        fs.unlink(`images/${filename}`, (err) => {
                            if (err) {
                                console.log("Erreur lors de la suppression de l'ancienne image: ", err);
                            }
                        });
                    }
                }
                // Mise à jour de la catégorie avec les nouvelles données
                return categoryDAO.updateCategory(categoryId, { $set: categoryData });
            })
            .then((modif) => {
                res.status(200).json({ message: 'Catégorie mise à jour avec succès', modif });
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
};

exports.editOption = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const optionId = req.params.id;
        const optionData = { ...req.body };

        const optionDAO = new OptionDAO(tenantId);
        const updatedOption = await optionDAO.findByIdAndUpdate(
            optionId,
            optionData,
            { new: true }
        );

        if (!updatedOption) {
            return res.status(404).json({ message: 'Option not found.' });
        }

        res.status(200).json(updatedOption);
    } catch (error) {
        console.error('Error updating option:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


exports.updateCategoryOrder = (req, res) => {

    const tenantId = req.auth.tenantId
    const orderedCategoryIds = req.body
    if (!orderedCategoryIds || !Array.isArray(orderedCategoryIds)) {
        return res.status(400).send({ message: 'Erreur lors de la réorganisation des catégories' });
    }

    const categoryDAO = new CategoryDAO(tenantId);
    const updatePromises = orderedCategoryIds.map((categoryId, index) => {
        return categoryDAO.updateCategory(categoryId, { orderCategory: index });
    });

    Promise.all(updatePromises)
        .then(() => {
            res.send({ message: 'Ordre mis à jour avec succès !' });
        })
        .catch(error => {
            if (error.code && error.code === 11000) {
                res.status(400).send({ message: 'Erreur: La valeur orderCategory doit être unique.' });
            } else {
                res.status(500).send({ message: 'Erreur lors de la mise à jour des catégories.' });
            }
        });
};

exports.addProductToCategory = async (req, res) => {

    const tenantId = req.auth.tenantId

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const productData = Object.keys(req.files).length > 0 ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
        } : {
            ...req.body,
        }

        // const product = new Product({
        //     ...productObject,
        //     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
        // });

        const productDAO = new CategoryDAO(tenantId);
        productDAO.createCategory(categoryData)

        const savedProduct = await product.save({ session });

        await Category.updateOne(
            { _id: req.params.id },
            { $push: { products: savedProduct._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Produit ajouté avec succès à la catégorie!', product: savedProduct });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ error: 'Il y a eu une erreur lors de l\'ajout du produit.' });
    }
};


exports.updateProductOrder = (req, res) => {
    // const newTitle = req.body.titleCategory;
    const productIds = Object.values(req.body.productsOrder);

    Category.updateOne({ _id: req.params.id }, { products: productIds })
        .then(() => res.status(200).json({ message: 'Catégorie modifiée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateProductOrder = (req, res) => {
    // const newTitle = req.body.titleCategory;
    const productIds = Object.values(req.body.productsOrder);

    Category.updateOne({ _id: req.params.id }, { products: productIds })
        .then(() => res.status(200).json({ message: 'Catégorie modifiée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.moveProductsToCategory = (req, res) => {
    const { sourceCategoryId, targetCategoryId, productIds } = req.body;

    // Vérifier si les IDs sont fournis
    if (!sourceCategoryId || !targetCategoryId || !productIds || productIds.length === 0) {
        return res.status(400).json({ message: 'Informations requises manquantes.' });
    }

    // Trouver la catégorie d'origine et retirer les produits
    Category.findByIdAndUpdate(
        sourceCategoryId,
        { $pull: { products: { $in: productIds } } },
        { new: true }
    )
        .exec()
        .then(() => {
            // Ajouter les produits à la catégorie de destination
            return Category.findByIdAndUpdate(
                targetCategoryId,
                { $addToSet: { products: { $each: productIds } } },
                { new: true }
            ).exec();
        })
        .then(() => res.status(200).json({ message: 'Produits déplacés avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.copyProductsToCategory = (req, res) => {
    const { sourceCategoryId, targetCategoryId, productIds } = req.body;

    // Vérifier si les IDs sont fournis
    if (!sourceCategoryId || !targetCategoryId || !productIds || productIds.length === 0) {
        return res.status(400).json({ message: 'Informations requises manquantes.' });
    }

    // Trouver la catégorie d'origine pour vérifier que les produits existent
    Category.findById(sourceCategoryId)
        .then(sourceCategory => {
            if (!sourceCategory) {
                return res.status(404).json({ message: 'Catégorie d\'origine non trouvée.' });
            }

            // Vérifier si tous les produits sont dans la catégorie d'origine
            const invalidProducts = productIds.filter(productId => !sourceCategory.products.includes(productId));
            if (invalidProducts.length) {
                return res.status(400).json({ message: 'Certains produits ne sont pas dans la catégorie d\'origine.', invalidProducts });
            }

            // Ajouter les produits à la catégorie de destination
            return Category.findByIdAndUpdate(
                targetCategoryId,
                { $addToSet: { products: { $each: productIds } } },
                { new: true }
            ).exec();
        })
        .then(() => res.status(200).json({ message: 'Produits copiés avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.removeProductFromCategory = (req, res) => {
    const { categoryId, productId } = req.body;

    // Vérifier si les IDs sont fournis
    if (!categoryId || !productId) {
        return res.status(400).json({ message: 'Informations requises manquantes.' });
    }

    // Retirer le produit de la catégorie
    Category.findByIdAndUpdate(
        categoryId,
        { $pull: { products: productId } },
        { new: true }
    )
        .then(updatedCategory => {
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Catégorie non trouvée.' });
            }
            res.status(200).json({ message: 'Produit retiré de la catégorie avec succès!', updatedCategory });
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteOption = async (req, res) => {
    const tenantId = req.auth.tenantId;
    const optionId = req.params.id;

    // Vérifier la validité des ID
    if (!tenantId || !optionId) {
        return res.status(400).json({ error: "Paramètres invalides" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const optionDAO = new OptionDAO(tenantId);
        await optionDAO.deleteOption(optionId);

        const productDAO = new ProductDAO(tenantId);
        await productDAO.removeOptionFromProducts(optionId);

        await session.commitTransaction();
        res.status(200).json({ message: 'Option supprimée !' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Erreur lors de la suppression de l\'option: ', error);
        res.status(500).json({ error: "Erreur serveur" });
    } finally {
        session.endSession();
    }
};
