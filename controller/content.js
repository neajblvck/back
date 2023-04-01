// PRODUCT CONTROLLER


const homeModel = require('../models/content');
const fs = require('fs');



exports.createPost = (req,res) => {

    const postObject = {...req.body}

    const post = new homeModel({
        ...postObject,
        imgPost: `${req.protocol}://${req.get('host')}/images/${req.files['imgPost'][0].filename}`
    });
    post.save()
        .then((product) => res.status(201).json({ message: 'Post enregistré !', post}))
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