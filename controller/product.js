// CATEGORY & PRODUCT CONTROLLER


const {Product, Category, Option} = require('../models/product');
const fs = require('fs');

exports.createOption = (req, res) => {
    const option = new Option({
        nom: req.body.nom,
        prix: req.body.prix
    });

    option.save()
        .then(savedOption => {
            res.status(201).json(savedOption);
        })
        .catch(error => {
            res.status(500).json({ message: "Erreur lors de l'ajout de l'option.", error: error.message });
        });
};


exports.deleteOption = (req, res) => {
    const optionId = req.params.id;

    Option.findByIdAndRemove(optionId)
        .then(deletedOption => {
            if (!deletedOption) {
                return res.status(404).json({ message: "Option introuvable." });
            }
            res.status(200).json({ message: "Option supprimée avec succès." });
        })
        .catch(error => {
            res.status(500).json({ message: "Erreur lors de la suppression de l'option.", error: error.message });
        });
};


// Contrôleur pour modifier l'ordre des options
exports.updateOptionsOrder = (req, res) => {
    const productId = req.params.id;
    const newOptionsOrder = req.body.optionsOrder; // Assurez-vous que ce tableau contient les ID d'options dans le nouvel ordre souhaité.

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




exports.createCategory = (req, res) => {
    console.log(req.body)
    const category = new Category({
        titleCategory: req.body.titleCategory,
        products: req.body.products
    });
    console.log(category)
    category.save()
        .then(() => res.status(201).json({ message: 'Catégorie créée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllCategories = (req, res) => {
    Category.find().populate('products')
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

exports.updateCategory = (req, res) => {
    const categoryObject = { ...req.body };
    
    Category.updateOne({ _id: req.params.id }, { ...categoryObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Catégorie mise à jour avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};


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
    .then((product)  => { return res.status(200).json({product})})
    .catch((error) => { return res.status(404).json({error})});
}

exports.getAllProduct = (req, res) =>{
    Product.find()
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


 exports.deleteProduct = (req, res) => {
    Product.findOne({ _id: req.params.id})
        .then(product => {
                const filename = product.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    product.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

