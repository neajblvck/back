// CONTENT CONTROLLER

const fs = require('fs');


const ContentDAO = require('../dao/contentDAO');

exports.createPost = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const imgPath = `${req.protocol}://${req.get('host')}/images/${req.files['imgPost'][0].filename}`;
        const postData = { ...req.body, imgPost: imgPath };
        const contentDAO = new ContentDAO(tenantId);
        await contentDAO.createPost(postData);
        res.status(201).json({ message: 'Post créé avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getContent = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const contentDAO = new ContentDAO(tenantId);
        const posts = await contentDAO.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updatePost = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const postId = req.params.id;
        let updateData = { ...req.body };
        const contentDAO = new ContentDAO(tenantId);
        

        if (req.files['imgPost']) {
            const newImgPath = `${req.protocol}://${req.get('host')}/images/${req.files['imgPost'][0].filename}`;
            updateData.imgPost = newImgPath;

            // Supprimer l'ancienne image
            const oldPost = await contentDAO.findPostById(postId);
            const filename = oldPost[0].imgPost.split('/images/')[1];
            console.log(filename)
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    console.log("Error deleting image: ", err);
                }
            });
        }

        await contentDAO.updatePost(postId, updateData);
        res.status(200).json({ message: 'Post mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouveau Hero
exports.createHero = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const heroData = {
            imgHero: `${req.protocol}://${req.get('host')}/images/${req.files['imgHero'][0].filename}`
        };
        const contentDAO = new ContentDAO(tenantId);
        await contentDAO.createHero(heroData);
        res.status(201).json({ message: 'Hero enregistré !' });
    } catch (error) {
        res.status(400).json({ error: 'Échec de l\'enregistrement' });
    }
};

// Obtenir l'image Hero
exports.getHero = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const contentDAO = new ContentDAO(tenantId);
        const hero = await contentDAO.getHero();
        res.status(200).json({ hero });
    } catch (error) {
        res.status(400).json({ error: 'Échec de la récupération' });
    }
};

// Mettre à jour un Hero existant
exports.postHero = async (req, res) => {
    try {
        const tenantId = req.auth.tenantId;
        const heroId = req.params.id;

        if (Object.keys(req.files).length > 0) {
            const nouvelleImage = `${req.protocol}://${req.get('host')}/images/${req.files['imgHero'][0].filename}`;

            // Récupérer l'ancien Hero pour obtenir l'URL de l'ancienne image
            const oldHero = await contentDAO.findHeroById(tenantId, heroId);
            const ancienneImage = oldHero[0].imgHero;

            const contentDAO = new ContentDAO(tenantId);
            await contentDAO.updateHero(heroId, { imgHero: nouvelleImage });

            // Supprimer l'ancienne image
            const ancienNomFichier = ancienneImage.split('/images/')[1];
            fs.unlink(`images/${ancienNomFichier}`, (err) => {
                if (err) {
                    console.log("Erreur lors de la suppression de l'ancienne image : ", err);
                }
            });
            res.status(200).json({ message: 'Hero mis à jour !' });
        } else {
            res.status(400).json({ message: 'Aucune nouvelle image fournie' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};


// publicStyle


exports.getStyle = (req, res, next) => {
    const tenantId = req.auth.tenantId; 

    const contentDAO = new ContentDAO(tenantId);
    contentDAO.getPublicStyle()
        .then(style => {
            if (!style) {
                return res.status(404).json({ message: 'PublicStyle non trouvé.' });
            }
            res.status(200).json(style);
        })
        .catch(error => res.status(500).json({ message: 'Erreur lors de la récupération du style' }));
};

exports.updateStyle = (req, res, next) => {
    const tenantId = req.auth.tenantId; 

    const contentDAO = new ContentDAO(tenantId);
    contentDAO.updatePublicStyle(req.body)
        .then(() => res.status(200).json({ message: 'Style créé ou mis à jour avec succès.' }))
        .catch(error => {
            console.error('Erreur lors de la mise à jour du style.', error);
            res.status(500).json({ message: 'Erreur lors de la mise à jour du style.' });
        });
};