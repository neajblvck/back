// CATEGORY & PRODUCT CONTROLLER


const { Product, Category, Options, Ensemble } = require('../models/product');
const fs = require('fs');
const mongoose = require('mongoose');

// exports.createOption = (req, res) => {
//     const { name, choiceType, customChoices, productChoices, productList } = req.body;

//     // Validation des données reçues
//     if (!name || !choiceType) {
//         return res.status(400).json({ message: "Nom de l'option et type de choix sont requis." });
//     }

//     if (choiceType === 'CustomChoice' && !Array.isArray(customChoices)) {
//         return res.status(400).json({ message: "Les choix personnalisés doivent être un tableau." });
//     }

//     if (choiceType === 'Product' && !Array.isArray(productChoices)) {
//         return res.status(400).json({ message: "Les choix de produit doivent être un tableau." });
//     }

//     // Création de l'option
//     let newOption = new Options({
//         name,
//         choiceType,
//         choices: choiceType === 'CustomChoice' ? customChoices : productChoices
//     });

//     // Sauvegarde de l'option dans la base de données
//     newOption.save()
//         .then(savedOption => {
//             // Si productList est fourni, mettre à jour les produits correspondants
//             if (Array.isArray(productList) && productList.length > 0) {
//                 return Product.updateMany(
//                     { _id: { $in: productList } },
//                     { $push: { options: savedOption._id } }
//                 );
//             }
//             return savedOption;
//         })
//         .then(result => {
//             // Réponse en cas de succès
//             const message = Array.isArray(productList) && productList.length > 0
//                 ? 'Option créée et ajoutée aux produits avec succès.'
//                 : 'Option créée avec succès.';
//             res.status(201).json({ message, option: result });
//         })
//         .catch(error => {
//             // Gestion des erreurs
//             res.status(500).json({ message: 'Erreur lors de la création de l\'option', error: error.message });
//         });
// };

exports.createOption = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, choiceType, qtMinimal, qtMaximal, multiply, customChoices, productChoices, productList } = req.body;

        // Validation des données
        if (!name || !choiceType) {
            throw new Error("Nom de l'option et type de choix sont requis.");
        }

        if (choiceType === 'CustomChoice' && !Array.isArray(customChoices)) {
            throw new Error("Les choix personnalisés doivent être un tableau.");
        }

        if (choiceType === 'Product' && !Array.isArray(productChoices)) {
            throw new Error("Les choix de produit doivent être un tableau.");
        }

        // Création de l'option
        let newOption = new Options({
            name,
            qtMinimal,
            qtMaximal,
            multiply,
            extraCost,
            choiceType,
            choices: choiceType === 'CustomChoice' ? customChoices : productChoices
        });

        await newOption.save({ session });

        // Mise à jour des produits si productList est fourni
        if (Array.isArray(productList) && productList.length > 0) {
            await Product.updateMany(
                { _id: { $in: productList } },
                { $push: { options: newOption._id } },
                { session }
            );
        }

        // Confirmation de la transaction
        await session.commitTransaction();
        res.status(201).json({ message: 'Option créée avec succès', option: newOption });
    } catch (error) {
        // En cas d'erreur, annulation de la transaction
        await session.abortTransaction();
        res.status(500).json({ message: 'Erreur lors de la création de l\'option', error: error.message });
    } finally {
        // Fermeture de la session
        session.endSession();
    }
};


exports.deleteOption = (req, res) => {
    const optionId = req.params.id;

    Options.findByIdAndRemove(optionId)
        .then(option => {
            if (!option) {
                return res.status(404).json({ message: "Option non trouvée" });
            }
            // Option trouvée et supprimée, maintenant retirez cette option des produits
            return Product.updateMany(
                { options: optionId },
                { $pull: { options: optionId } }
            );
        })
        .then(() => {
            res.status(200).json({ message: "Option supprimée avec succès" });
        })
        .catch(error => {
            res.status(500).json({ message: "Erreur lors de la suppression de l'option", error: error.message });
        });
};


exports.addOptionToProduct = (req, res) => {
    // ID du produit et de l'option provenant de la requête (par exemple, via le corps de la requête ou les paramètres)
    const { productId, optionId } = req.body;

    // Trouver le produit par son ID
    Product.findById(productId)
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




exports.getAllOptions = (req, res) => {
    Options.find()
        .populate({
            path: 'choices',
            match: { choiceType: 'Product' }, // Filtrer pour ne peupler que les choix de type 'Product'
            populate: {
                path: 'choiceItem', // Assurez-vous que 'choiceItem' est le nom correct du champ dans 'ChoiceSchema'
                model: 'Product' // Remplacez 'Product' par le nom exact du modèle de produit
            }
        })
        .then(options => res.status(200).json(options))
        .catch(error => res.status(500).json({ error }));
};

exports.getOptionById = (req, res) => {
    Options.findById(req.params.id)
        .then(option => {
            if (!option) {
                return res.status(404).json({ message: 'Option not found.' });
            }
            res.status(200).json(option);
        })
        .catch(error => res.status(500).json({ error }));
};


exports.updateOption = (req, res) => {
    Options.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then(updatedOption => {
            if (!updatedOption) {
                return res.status(404).json({ message: 'Option not found.' });
            }
            res.status(200).json(updatedOption);
        })
        .catch(error => res.status(400).json({ error }));
};


exports.deleteOption = (req, res) => {
    Options.findByIdAndRemove(req.params.id)
        .then(deletedOption => {
            if (!deletedOption) {
                return res.status(404).json({ message: 'Option not found.' });
            }
            res.status(200).json({ message: 'Option deleted successfully.' });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.addChoiceToOption = (req, res) => {
    const choice = {
        choiceType: req.body.choiceType,
        choiceItem: req.body.choiceItem,
        additionalCost: req.body.additionalCost
    };

    Options.findById(req.params.optionId)
        .then(option => {
            if (!option) {
                return res.status(404).json({ message: 'Option not found.' });
            }
            option.choices.push(choice);
            return option.save();
        })
        .then(updatedOption => res.status(201).json(updatedOption))
        .catch(error => res.status(400).json({ error }));
};

exports.updateChoice = (req, res) => {
    Options.findById(req.params.optionId)
        .then(option => {
            if (!option) {
                return res.status(404).json({ message: 'Option not found.' });
            }
            const choice = option.choices.id(req.params.choiceId);
            if (!choice) {
                return res.status(404).json({ message: 'Choice not found.' });
            }
            choice.choiceType = req.body.choiceType || choice.choiceType;
            choice.choiceItem = req.body.choiceItem || choice.choiceItem;
            choice.additionalCost = req.body.additionalCost || choice.additionalCost;
            return option.save();
        })
        .then(updatedOption => res.status(200).json(updatedOption))
        .catch(error => res.status(400).json({ error }));
};


exports.deleteChoice = (req, res) => {
    Options.findById(req.params.optionId)
        .then(option => {
            if (!option) {
                return res.status(404).json({ message: 'Option not found.' });
            }
            const choice = option.choices.id(req.params.choiceId);
            if (!choice) {
                return res.status(404).json({ message: 'Choice not found.' });
            }
            choice.remove();
            return option.save();
        })
        .then(updatedOption => res.status(200).json({ message: 'Choice deleted successfully.' }))
        .catch(error => res.status(500).json({ error }));
};



// Contrôleur pour modifier l'ordre des options
exports.updateOptionsOrder = (req, res) => {
    const productId = req.params.id;
    const newOptionsOrder = req.body.optionsOrder;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Product not found!' });
            }

            product.optionsOrder = newOptionsOrder;
            return product.save();
        })
        .then(updatedProduct => res.status(200).json({ message: 'Options order updated!', product: updatedProduct }))
        .catch(error => res.status(500).json({ error }));
};


// ENSEMBLE CONTROLLER
exports.createEnsemble = (req, res) => {
    const ensemble = new Ensemble({
        name: req.body.name,
        categoryIds: req.body.categoryIds || []
    });

    ensemble.save()
        .then(() => res.status(201).json({ message: 'Ensemble créé avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllEnsembles = (req, res) => {
    Ensemble.find()
        .populate('categoryIds') // Récupérer les détails des catégories
        .then(ensembles => res.json(ensembles))
        .catch(error => res.status(500).json({ error }));
};

exports.getEnsembleById = (req, res) => {
    Ensemble.findById(req.params.id)
        .populate('categoryIds') // Récupérer les détails des catégories
        .then(ensemble => {
            if (!ensemble) {
                return res.status(404).json({ message: 'Ensemble non trouvé' });
            }
            res.json(ensemble);
        })
        .catch(error => res.status(500).json({ error }));
};

exports.updateEnsemble = (req, res) => {
    Ensemble.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.status(200).json({ message: 'Ensemble mis à jour avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteEnsemble = (req, res) => {
    Ensemble.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Ensemble supprimé avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.addCategoryToEnsemble = (req, res) => {
    const categoryId = req.body.categoryId;

    Ensemble.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { categoryIds: categoryId } }, // $addToSet garantit que categoryId est unique
        { new: true }
    )
        .populate('categoryIds')
        .then(ensemble => res.status(200).json(ensemble))
        .catch(error => res.status(400).json({ error }));
};

// CATEGORY CONTROLLER

exports.createCategory = (req, res) => {
    console.log('cat')
    const category = new Category({
        titleCategory: req.body.titleCategory,
        descriptionCategory: req.body.deleteCategory,
        available: req.body.available,
        products: req.body.products,
        imgCategory: `${req.protocol}://${req.get('host')}/images/${req.files['imgCategory'][0].filename}`
    });
    category.save()
        .then((createdCategory) => res.status(201).json({ message: 'Catégorie créée avec succès !', createdCategory }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllCategories = (req, res) => {
    Category.find()
        .sort('orderCategory') // Trie les catégories par orderCategory
        .populate({
            path: 'products', // Peuple d'abord les produits
            populate: {
                path: 'options', // Ensuite, peuple les options de chaque produit
                model: 'Options', 
                populate: {
                    path: 'choices.choiceItem', // Peuple les choix de type Product
                    model: 'Product', 
                    // match: { choiceType: 'Product' } // Condition pour peupler seulement si le type est 'Product'
                }
            }
        })
        .then(categories => {
            res.json(categories);
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({ message: 'Erreur lors de la récupération des catégories' });
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





    exports.addProductToCategory = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const productObject = { ...req.body };

            if (isNaN(productObject.prixMenu)) {
                delete productObject.prixMenu;
            }

            const product = new Product({
                ...productObject,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
            });

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
            console.log(error)
            await session.abortTransaction();
            session.endSession();

            res.status(500).json({ error: 'Il y a eu une erreur lors de l\'ajout du produit.' });
        }
    };

exports.updateCategoryOrder = (req, res) => {
    const orderedCategoryIds = req.body
    if (!orderedCategoryIds || !Array.isArray(orderedCategoryIds)) {
        return res.status(400).send({ message: 'Le tableau orderedCategoryIds est requis.' });
    }

    const updatePromises = orderedCategoryIds.map((categoryId, index) => {
        return Category.findByIdAndUpdate(categoryId, { orderCategory: index }).exec();
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


exports.updateProductOrder = (req, res) => {
    // const newTitle = req.body.titleCategory;
    const productIds = Object.values(req.body.productsOrder);

    Category.updateOne({ _id: req.params.id }, { products: productIds })
        .then(() => res.status(200).json({ message: 'Catégorie modifiée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.editCategory = (req, res) => {
    const categoryObject = Object.keys(req.files).length > 0 ? {
        ...req.body,
        imgCategory: `${req.protocol}://${req.get('host')}/images/${req.files['imgCategory'][0].filename}`
    } : {
        ...req.body,
    }

    Category.findOne({ _id: req.params.id })
        .then((category) => {

            Category.updateOne({ _id: req.params.id }, { ...categoryObject, _id: req.params.id })
                .then((modif) => {
                    if (Object.keys(req.files).length > 0) {
                        const filename = category.imgCategory.split('/images/')[1]
                        fs.unlink(`images/${filename}`, (err) => {
                            if (err) {
                                console.log("Error deleting image: ", err);
                            }
                        });
                    }
                    res.status(200).json({ modif });
                })
                .catch(error => res.status(401).json({ error }));

        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}



exports.deleteCategory = (req, res) => {
    Category.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Catégorie supprimée avec succès !' }))
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



exports.createProduct = (req, res) => {

    const productObject = { ...req.body }
    console.log(req.body)
    if (isNaN(productObject.prixMenu)) {
        delete productObject.prixMenu
    }
    const product = new Product({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
    });
    product.save()
        .then((product) => res.status(201).json({ message: 'Objet enregistré !', product }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneProduct = (req, res) => {
    const id = req.params.id;
    Product.findOne({ _id: id })
        .populate('options')
        .then((product) => { return res.status(200).json({ product }) })
        .catch((error) => { return res.status(404).json({ error }) });
}

exports.getAllProduct = (req, res) => {
    Product.find()
        .populate('options')
        .then((Allproduct) => { return res.status(200).json({ Allproduct }) })
        .catch((error) => { return res.status(400).json({ error }) });
}

// exports.editProduct = (req, res) =>{

//     const productObject = req.file ? {
//         ...JSON.parse(req.body.product),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : { ...req.body };

//     delete productObject._userId;
//     Product.findOne({_id: req.params.id})
//         .then((product) => {
//             if (product.userId != req.auth.userId) {
//                 res.status(401).json({ message : 'Not authorized'});
//             } else {
//                 product.updateOne({ _id: req.params.id}, { ...productObject, _id: req.params.id})
//                 .then(() => res.status(200).json({message : 'Objet modifié!'}))
//                 .catch(error => res.status(401).json({ error }));
//             }
//         })
//         .catch((error) => {
//             res.status(400).json({ error });
//         });
// }

exports.editProduct = (req, res) => {
    console.log(req.body)

    const productObject = Object.keys(req.files).length > 0 ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
    } : {
        ...req.body,
    }

    Product.findOne({ _id: req.params.id })
        .then((product) => {
            // if (product.userId != req.auth.userId) {
            //     res.status(401).json({ message : 'Not authorized'});
            // } else {

            Product.updateOne({ _id: req.params.id }, { ...productObject, _id: req.params.id })
                .then((modif) => {
                    if (Object.keys(req.files).length > 0) {
                        const filename = product.imageUrl.split('/images/')[1]
                        fs.unlink(`images/${filename}`, (err) => {
                            if (err) {
                                console.log("Error deleting image: ", err);
                            }
                        });
                    }
                    res.status(200).json({ modif });
                })
                .catch(error => res.status(401).json({ error }));

        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}


//  exports.deleteProduct = (req, res) => {
//     Product.findOne({ _id: req.params.id})
//         .then(product => {
//                 const filename = product.imageUrl.split('/images/')[1];
//                 fs.unlink(`images/${filename}`, () => {
//                     product.deleteOne({_id: req.params.id})
//                         .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
//                         .catch(error => res.status(401).json({ error }));
//                 });

//         })
//         .catch( error => {
//             res.status(500).json({ error });
//         });
//  };


exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
        .then(product => {
            req.imageUrlToDelete = product.imageUrl; // définir l'URL de l'image à supprimer
            console.log("Trouvé le produit avec l'URL d'image :", product.imageUrl);

            product.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

