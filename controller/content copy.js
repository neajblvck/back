// CONTENT CONTROLLER


const { heroModel, homeModel, publicStyle } = require('../models/content');
const fs = require('fs');



exports.createPost = (req,res) => {

    console.log('home')

    const postObject = {...req.body}

    const post = new homeModel({
        ...postObject,
        imgPost: `${req.protocol}://${req.get('host')}/images/${req.files['imgPost'][0].filename}`
    });
    post.save()
        .then((post) => res.status(201).json({ message: 'Post enregistré !', post}))
        .catch(error => res.status(400).json({ error }));

};


exports.getContent = (req, res) => {
    homeModel.find()
        .then((home) => { return res.status(200).json({ home }) })
        .catch((error) => { return res.status(400).json({ error }) });
};


exports.postContent = (req, res) =>{



    const postObject = Object.keys(req.files).length > 0 ? {
        ...req.body,
        imgPost: `${req.protocol}://${req.get('host')}/images/${req.files['imgPost'][0].filename}`
    }:{ 
        titlePost: req.body.titlePost,
        descriptionPost: req.body.descriptionPost
    }

    homeModel.findOne({_id: req.params.id})
        .then((post) => {
            // if (product.userId != req.auth.userId) {
            //     res.status(401).json({ message : 'Not authorized'});
            // } else {
                
                homeModel.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
                .then((modif) => {
                    if (Object.keys(req.files).length > 0) {
                        const filename = post.imgPost.split('/images/')[1]
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

// hero

// Créer un nouveau Hero
exports.createHero = (req, res) => {
    const hero = new heroModel({
        imgHero: `${req.protocol}://${req.get('host')}/images/${req.files['imgHero'][0].filename}`
    });

    hero.save()
        .then((newHero) => res.status(201).json({ message: 'Hero enregistré !', newHero }))
        .catch(error => res.status(400).json({ error: 'Échec de l\'enregistrement' }));
};

// Obtenir l'image Hero
exports.getHero = (req, res) => {
    heroModel.find()
        .then((hero) => { return res.status(200).json({ hero }) })
        .catch((error) => { return res.status(400).json({ error: 'Échec de la récupération' }) });
};

// Mettre à jour un Hero existant
exports.postHero = (req, res) => {
    if (Object.keys(req.files).length > 0) {
        const nouvelleImage = `${req.protocol}://${req.get('host')}/images/${req.files['imgHero'][0].filename}`;
        
        heroModel.findOne({ _id: req.params.id })
            .then((hero) => {
                const ancienneImage = hero.imgHero;

                heroModel.updateOne({ _id: req.params.id }, { imgHero: nouvelleImage })
                    .then((modif) => {
                        // Supprimer l'ancienne image
                        const ancienNomFichier = ancienneImage.split('/images/')[1];
                        fs.unlink(`images/${ancienNomFichier}`, (err) => {
                            if (err) {
                                console.log("Erreur lors de la suppression de l'ancienne image : ", err);
                            }
                        });
                        res.status(200).json({ message: 'Hero mis à jour !', modif });
                    })
                    .catch(error => res.status(401).json({ error: 'Échec de la mise à jour' }));
            })
            .catch((error) => {
                res.status(400).json({ error: 'Hero non trouvé' });
            });
    }
};


// publicStyle



exports.getStyle = (req, res, next) => {
    publicStyle.findOne({})
        .then(publicStyle => {
            if (!publicStyle) {
                return res.status(404).json({ message: 'PublicStyle non trouvé.' });
            }
            res.status(200).json(publicStyle);
        })
        .catch(error => res.status(500).json({ message: 'Erreur lors de la récupération du style public.' }));
};

exports.updateStyle = (req, res, next) => {
    const newPublicStyle = new publicStyle({
        ...req.body
    });
    
    publicStyle.findOne({})
        .then(publicStyle => {
            if (publicStyle) {
                // Update existing
                Object.assign(publicStyle, req.body);
                return publicStyle.save()
            } else {
                // Create new
                return newPublicStyle.save(); 
            }
        })
        .then((res) => res.status(200).json({ message: 'Style créé ou mis à jour avec succès.', res }))
        .catch(error => {
            console.error('Erreur lors de la création ou de la mise à jour du style.', error);
            res.status(500).json({ message: 'Erreur lors de la création ou de la mise à jour du style.' });
        });

    }