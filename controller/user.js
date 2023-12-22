const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (CentralUserDAO) => {
    return {
        signup: async (req, res) => {
            try {
                const tenantId = req.auth.tenantId;
                const hash = await bcrypt.hash(req.body.password, 10);
                await CentralUserDAO.createUser(tenantId, { ...req.body, password: hash, tenantId: tenantId });
                res.status(201).json({ message: 'Utilisateur créé !' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        login: async (req, res) => {
            try {
                console.log(req.body)
                const user = await CentralUserDAO.findUserByEmail(req.body.email);
                if (!user) {
                    console.log('pas duser')
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                
                const valid = await bcrypt.compare(req.body.password, user.password);
                if (!valid) {
                    console.log('pas valide')
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }

                const token = jwt.sign(
                    { userId: user._id, tenantId: user.tenantId },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                );

                res.status(200).json({ token });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        getAllUsers: async (req, res) => {
            try {
                const users = await CentralUserDAO.findAllUsers();
                res.status(200).json({ users });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        getUser: async (req, res) => {
            try {
                const user = await CentralUserDAO.findUserById(req.params.id);
                if (!user) {
                    return res.status(404).json({ message: 'Utilisateur non trouvé' });
                }
                res.status(200).json({ user });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        editUser: async (req, res) => {
            try {
                await CentralUserDAO.updateUserById(req.params.id, req.body);
                res.status(200).json({ message: 'Utilisateur mis à jour' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        deleteUser: async (req, res) => {
            try {
                await CentralUserDAO.deleteUserById(req.params.id);
                res.status(200).json({ message: 'Utilisateur supprimé' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    };
};
