// CATEGORY & PRODUCT CONTROLLER


const {Product, Category, Option, Ensemble} = require('../models/product');
const fs = require('fs');
const mongoose = require('mongoose');

exports.createOption = (req, res) => {
    const { name, productList, choices } = req.body;
    console.log(productList)

    const newOption = new Option({
        name,
        choices: choices.map(choice => ({
            choiceType: choice.choiceType,
            choiceItem: choice.choiceItem,
            choiceName: choice.choiceName,
            additionalCost: choice.additionalCost
        }))
    });

    newOption.save()
        .then(savedOption => {
            console.log('option saved', savedOption)
            // Si productList est fourni, mettez à jour les produits correspondants
            if (productList && productList.length > 0) {
                return Product.updateMany(
                    { _id: { $in: productList } },
                    { $push: { options: savedOption._id } }
                );
            }
            return savedOption;
        })
        .then(result => {
            res.status(201).json({ message: 'Nouvelle option ajoutée avec succès', option: result });
        })
        .catch(error => {
            res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'option', error: error.message });
        });
};

exports.deleteOption = (req, res) => {
    const optionId = req.params.id;

    Option.findByIdAndRemove(optionId)
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



  
  exports.getAllOptions = (req, res) => {
    Option.find()
      .then(options => res.status(200).json(options))
      .catch(error => res.status(500).json({ error }));
  };

  exports.getOptionById = (req, res) => {
    Option.findById(req.params.id)
      .then(option => {
        if (!option) {
          return res.status(404).json({ message: 'Option not found.' });
        }
        res.status(200).json(option);
      })
      .catch(error => res.status(500).json({ error }));
  };

  
  exports.updateOption = (req, res) => {
    Option.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then(updatedOption => {
        if (!updatedOption) {
          return res.status(404).json({ message: 'Option not found.' });
        }
        res.status(200).json(updatedOption);
      })
      .catch(error => res.status(400).json({ error }));
  };

  
  exports.deleteOption = (req, res) => {
    Option.findByIdAndRemove(req.params.id)
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
  
    Option.findById(req.params.optionId)
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
    Option.findById(req.params.optionId)
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
    Option.findById(req.params.optionId)
      .then(option => {
        if (!option) {
          return res.status(404).json({ message: 'Option not found.' });
        }
        const choice = option.choice.id(req.params.choiceId);
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
                model: 'Option' // Assurez-vous que c'est le nom correct de votre modèle d'option
            }
        })
        .then(categories => {
            res.json(categories);
        })
        .catch(error => {
            res.status(500).send({ message: 'Erreur lors de la récupération des catégories' });
        });
},



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

// exports.addProductToCategory = (req, res) => {
//     const productObject = {...req.body}
//     if (isNaN(productObject.prixMenu)){
//         delete productObject.prixMenu
//     }
//     const product = new Product({
//         ...productObject,
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
//     });
    
//     product.save()
//         .then(savedProduct => {
//             console.log(savedProduct)
//             console.log(req.params)
//             return Category.updateOne(
//                 { _id: req.params.id }, 
//                 { $push: { products: savedProduct._id } }
//             )
//             .then(() => {
//                 res.status(200).json({ message: 'Produit ajouté avec succès à la catégorie!', product: savedProduct });
//             });
//         })
//         .catch(error => {
//             // Gérez les erreurs
//             res.status(500).json({ error: 'Il y a eu une erreur lors de l\'ajout du produit.' });
//         });
// };




exports.addProductToCategory = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productObject = {...req.body};
        
        if (isNaN(productObject.prixMenu)){
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
    
    Category.updateOne({ _id: req.params.id }, { products: productIds})
            .then(() => res.status(200).json({ message: 'Catégorie modifiée avec succès !' }))
            .catch(error => res.status(400).json({ error }));
};


exports.editCategory = (req, res) => {
    const categoryObject = Object.keys(req.files).length > 0 ? {
        ...req.body,
        imgCategory: `${req.protocol}://${req.get('host')}/images/${req.files['imgCategory'][0].filename}`
    }:{ 
        ...req.body,
    }
    
    Category.findOne({_id: req.params.id})
        .then((category) => {

                Category.updateOne({ _id: req.params.id}, { ...categoryObject, _id: req.params.id})
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



exports.createProduct = (req,res) => {

    const productObject = {...req.body}
    if (isNaN(productObject.prixMenu)){
        delete productObject.prixMenu
    }
    const product = new Product({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
    });
    product.save()
        .then((product) => res.status(201).json({ message: 'Objet enregistré !', product}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneProduct = (req, res) => {
    const id = req.params.id;
    Product.findOne({_id: id})
    .populate('options')
    .then((product)  => { return res.status(200).json({product})})
    .catch((error) => { return res.status(404).json({error})});
}

exports.getAllProduct = (req, res) =>{
    Product.find()
    .populate('options')
    .then((Allproduct)  => { return res.status(200).json({Allproduct})})
    .catch((error) => { return res.status(400).json({error})});
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

exports.editProduct = (req, res) =>{

    const productObject = Object.keys(req.files).length > 0 ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
    }:{ 
        ...req.body,
    }
    
    Product.findOne({_id: req.params.id})
        .then((product) => {
            // if (product.userId != req.auth.userId) {
            //     res.status(401).json({ message : 'Not authorized'});
            // } else {
                
                Product.updateOne({ _id: req.params.id}, { ...productObject, _id: req.params.id})
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

            product.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

