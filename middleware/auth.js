const jwt = require('jsonwebtoken');

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
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
        
    } catch (error) {
        res.status(401).json({ message: "Non autorisé" });
    }
};


module.exports = authMiddleware