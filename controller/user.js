// CONTROLLER USER

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const Session = require('../models/session');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new userModel({
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: req.body.email, 
                role: req.body.role,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};




exports.login = (req, res) => {
    const email = decodeURIComponent(req.body.email);
    const password = decodeURIComponent(req.body.password);

    userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }

            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }

                    const sessionId = new mongoose.Types.ObjectId();

                    const token = jwt.sign(
                        { sessionId, userId: user._id,}, // <-- tenantId: user.tenantId 
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN }
                    );

                    Session.deleteMany({ userId: user._id })
                        .then(() => {
                            const newSession = new Session({ userId: user._id, sessionId });
                            newSession.save()
                                .then(() => res.status(200).json({ token }))
                                .catch(error => res.status(500).json({ error: error.message }));
                        })
                        .catch(error => res.status(500).json({ error: error.message }));
                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error: error.message }));
};




exports.getAllUsers = (req, res) => {
    userModel.find()
        .then((AllUsers) => { return res.status(200).json({ users: AllUsers }) })
        .catch((error) => { return res.status(400).json({ error }) });

};

exports.getUser = (req, res) => {
    const id = req.params.id;
    userModel.findOne({ _id: id })
        .then((User) => { return res.status(200).json({ User }) })
        .catch((error) => { return res.status(400).json({ error }) });

};



exports.editUser = (req, res) => {
    const userObject = { ...req.body }
    newUserName = userObject.name
    newUserSurname = userObject.surname
    newUserPhone = userObject.phone
    newUserEmail = userObject.email
    userModel.findOne({ _id: req.params.id })

        //vérifie si l'objet à modifier appartient à l'utilisateur
        .then((user) => {
            if (req.auth.userId == '6409c0663d01483e0549bb2c') {
                userModel.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
                    .then(modif => res.status(200).json({ modif }))
                    .catch(error => res.status(401).json({ error }))
            } else if (user._id != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
                // premier param = élément à modifier, deuxième = modification à faire
            } else {
                userModel.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
                    .then(modif => res.status(200).json({ modif }))
                    .catch(error => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};



// A CORRIGER CAR JAI FAIS DES IF POUR RIEN
// exports.deleteUser = (req, res) => {
//     userModel.findOne({ _id: req.params.id })
//         .then(user => {
//             if (req.auth.userId) {
//                 userModel.deleteOne({ _id: req.params.id })
//                     .then(result => res.status(200).json({ result }))
//                     .catch(error => res.status(401).json({ error }))
//             } else if (user._id != req.auth.userId) {
//                 res.status(401).json({ message: 'Not authorized' });
//             } else {
//                 userModel.deleteOne({ _id: req.params.id })
//                     .then(result => res.status(200).json({ result }))
//                     .catch(error => res.status(401).json({ error }))
//             }
//         })
//         .catch(error => {
//             res.status(500).json({ error })
//         })
// };


exports.deleteUser = (req, res) => {
    userModel.findOne({ _id: req.params.id })
        .then(user => {
            // Vérifiez si l'utilisateur trouvé correspond à l'utilisateur authentifié
            if (user && user._id.toString() === req.auth.userId) {
                userModel.deleteOne({ _id: req.params.id })
                    .then(result => res.status(200).json({ result }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};