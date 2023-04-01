// PRODUCT CONTROLLER


const productModel = require('../models/product');
const fs = require('fs');


exports.createProduct = (req,res) => {

    const productObject = {...req.body}
    if (isNaN(productObject.prixMenu)){
        delete productObject.prixMenu
    }
    const product = new productModel({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files['image'][0].filename}`
    });
    product.save()
        .then((product) => res.status(201).json({ message: 'Objet enregistré !', product}))
        .catch(error => res.status(400).json({ error }));

};

exports.getOneProduct = (req, res) => {
    const id = req.params.id;
    productModel.findOne({_id: id})
    .then((product)  => { return res.status(200).json({product})})
    .catch((error) => { return res.status(404).json({error})});
}

exports.getAllProduct = (req, res) =>{
    productModel.find()
    .then((Allproduct)  => { return res.status(200).json({Allproduct})})
    .catch((error) => { return res.status(400).json({error})});
} 

// exports.editProduct = (req, res) =>{

//     const productObject = req.file ? {
//         ...JSON.parse(req.body.product),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : { ...req.body };
  
//     delete productObject._userId;
//     productModel.findOne({_id: req.params.id})
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


  

    productModel.findOne({_id: req.params.id})
        .then((product) => {
            // if (product.userId != req.auth.userId) {
            //     res.status(401).json({ message : 'Not authorized'});
            // } else {
                
                productModel.updateOne({ _id: req.params.id}, { ...productObject, _id: req.params.id})
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
    productModel.findOne({ _id: req.params.id})
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

