const jwt = require('jsonwebtoken');
const Session = require('../models/session');
// // extraction du token
// const extractBearer = authorization => {
//     if (typeof authorization !== 'string') {
//         return false
//     }
//     const matches = authorization.match(/(bearer)\s+(\S+)/i)
//     return matches && matches[2]
// }

// // vérif de la présence du token
// const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization && extractBearer(req.headers.authorization)

//     if (!token) {
//         return res.status(401).json({ message: 'Pbm Token' })
//     }

//     // vérifier la validité du token
//     jwt.verify(token, process.env.JWT_SECRET), (err, decodedToken) => {
//         if (err) {
//             return res.status(401).json({ message: 'Token invalide' })
//         }
//         next();
//     }
// }



const authMiddleware = (req, res, next) => {
    let decodedToken;
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Non autorisé" });
    }

    const userId = decodedToken.userId
    const sessionId = decodedToken.sessionId

    Session.findOne({ userId: userId, sessionId: sessionId})
        .then(session => {
            console.log(session)
            if (!session) {
                return res.status(401).send('Session invalide ou expirée');
            }
            req.auth = { userId: decodedToken.userId };
            next();
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "Erreur lors de la vérification de la session" });
        });
};

module.exports = authMiddleware;
