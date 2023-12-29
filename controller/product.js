// CATEGORY & PRODUCT CONTROLLER

const fs = require('fs');
const mongoose = require('mongoose');

const CategoryDAO = require('../dao/categoryDAO');
const ProductDAO = require('../dao/productDAO');

// const tenantId = '6585b1ad29f79ac89326f9ce'

exports.createProduct = (req, res) => {
    const tenantId = req.auth.tenantId
    const productData = Object.keys(req.files).length > 0 ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
    } : {
        ...req.body,
    }
    const productDAO = new ProductDAO(tenantId);
    productDAO.createProduct(productData)
        .then((product) => res.status(201).json({ message: 'Produit créé avec succès !', product }))
        .catch(error => res.status(400).json({ error }));
};

exports.addProductToCategory = async (req, res) => {
    const tenantId = req.auth.tenantId
    const categoryId = req.params.id

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productData = Object.keys(req.files).length > 0 ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
        } : {
            ...req.body,
        }

        const productDAO = new ProductDAO(tenantId);
        const savedProduct = await productDAO.createProduct(productData, {session})

        const categoryDAO = new CategoryDAO(tenantId);
        await categoryDAO.updateCategory(
            categoryId, 
            {$push: { products: savedProduct._id }},
            {session});

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Produit ajouté avec succès à la catégorie!', product: savedProduct });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: 'Il y a eu une erreur lors de l\'ajout du produit.' });
    }
};

exports.getAllProducts = (req, res) => {
    const tenantId = req.auth.tenantId
    const productDAO = new ProductDAO(tenantId);
    productDAO.getAllProducts()
        .then((Allproduct) => { return res.status(200).json({ Allproduct }) })
        .catch((error) => { return res.status(400).json({ error }) });
};

exports.editProduct = (req, res) => {
    const tenantId = req.auth.tenantId;
    const productId = req.params.id;

    let productData = {...req.body};

    const productDAO = new ProductDAO(tenantId);
    productDAO.findProduct(productId)
        .then((oldProduct) => {
            if (Object.keys(req.files).length > 0) {
                // Mise à jour de l'URL de la nouvelle image
                productData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`;

                // Suppression de l'ancienne image si elle existe
                if (oldProduct.imageUrl) {
                    const filename = oldProduct.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            console.log("Erreur lors de la suppression de l'ancienne image: ", err);
                        }
                    });
                }
            }
            // Mise à jour de la catégorie avec les nouvelles données
            return productDAO.updateProduct(productId, productData);
        })
        .then((modif) => {
            res.status(200).json({ message: 'Catégorie mise à jour avec succès', modif });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteProduct = async (req, res) => {
    const tenantId = req.auth.tenantId;
    const productId = req.params.id;
    const productDAO = new ProductDAO(tenantId);

    try {
        const product = await productDAO.findProduct(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        await productDAO.deleteProduct(productId);
        const categoryDAO = new CategoryDAO(tenantId);
        await categoryDAO.removeProductFromCategories(productId);

        // Suppression de l'image si elle existe
        if (product.imageUrl) {
            const filename = product.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, err => {
                if (err) {
                    console.error("Erreur lors de la suppression de l'image: ", err);
                }
            });
        }

        return res.status(200).json({ message: 'Produit supprimé !' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit: ', error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};


exports.addOptionToProduct = (req, res) => {
    // ID du produit et de l'option provenant de la requête (par exemple, via le corps de la requête ou les paramètres)
    const { productId, optionId } = req.body;

    // Trouver le produit par son ID
    Products.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "Produit non trouvé" });
            }

            // Vérifier si l'option existe déjà dans le produit
            if (product.options.includes(optionId)) {
                return res.status(400).json({ message: "Cette option est déjà ajoutée au produit" });
            }

            // Ajouter l'option au produit
            product.options.push(optionId);

            // Sauvegarder les modifications sur le produit
            return product.save();
        })
        .then(savedProduct => {
            res.status(200).json({ message: "Option ajoutée avec succès", product: savedProduct });
        })
        .catch(error => {
            res.status(500).json({ message: "Erreur lors de l'ajout de l'option", error: error.message });
        });
};

exports.removeOptionFromProduct = (req, res) => {
    const { productId, optionId } = req.params;

    // Vérifier si les identifiants du produit et de l'option sont fournis
    if (!productId || !optionId) {
        return res.status(400).json({ message: "Identifiants du produit et de l'option requis." });
    }

    // Mettre à jour le produit en retirant l'option
    Product.findByIdAndUpdate(
        productId,
        { $pull: { options: optionId } }, // $pull pour retirer l'option de la liste
        { new: true } // Renvoie le document mis à jour
    )
    .then(updatedProduct => {
        if (!updatedProduct) {
            return res.status(404).json({ message: "Produit non trouvé ou identifiant incorrect." });
        }
        res.status(200).json({ message: "Option retirée du produit avec succès.", product: updatedProduct });
    })
    .catch(error => {
        res.status(500).json({ message: "Erreur lors de la suppression de l'option du produit.", error: error.message });
    });
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

exports.removeProductFromCategory = (req, res) => {

    const tenantId = req.auth.tenantId
    const { categoryId, productId } = req.body;

    // Vérifier si les IDs sont fournis
    if (!categoryId || !productId) {
        return res.status(400).json({ message: 'Informations requises manquantes.' });
    }

    // Retirer le produit de la catégorie
    const categoryDAO = new CategoryDAO(tenantId);
    categoryDAO.updateCategory(
        categoryId, 
        {$pull: { products: productId}},
        { new: true })
            .then(updatedCategory => {
                if (!updatedCategory) {
                    return res.status(404).json({ message: 'Catégorie non trouvée.' });
                }
                res.status(200).json({ message: 'Produit retiré de la catégorie avec succès!', updatedCategory });
            })
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
// exports.getOneProduct = (req, res) => {
//     const id = req.params.id;
//     Product.findOne({ _id: id })
//         .populate('options')
//         .then((product) => { return res.status(200).json({ product }) })
//         .catch((error) => { return res.status(404).json({ error }) });
// }
