const jwt = require('jsonwebtoken');
const Session = require('../models/session');


// const authMiddleware = (req, res, next) => {
//     let decodedToken;
    
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//         return res.status(401).json({ message: "Non autorisé" });
//     }

//     const userId = decodedToken.userId
//     const sessionId = decodedToken.sessionId

//     Session.findOne({ userId: userId, sessionId: sessionId})
//         .then(session => {
//             console.log(session)
//             if (!session) {
//                 return res.status(401).send('Session invalide ou expirée');
//             }
//             req.auth = { userId: decodedToken.userId };
//             next();
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(500).json({ message: "Erreur lors de la vérification de la session" });
//         });
// };

// module.exports = authMiddleware;


const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const tenantId = decodedToken.tenantId;
        const userId = decodedToken.userId;

        const session = await Session.findOne({ userId: userId, sessionId: decodedToken.sessionId });
        if (!session) {
            return res.status(401).send('Session invalide ou expirée');
        }

        req.auth = { userId: userId, tenantId: tenantId};
        console.log('next')
        next();
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return res.status(401).json({ message: "Non autorisé" });
    }
};

module.exports = authMiddleware;



