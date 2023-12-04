// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const dbConnections = {};

// app.use((req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(401).json({ message: 'Aucun token fourni' });
//     }

//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const tenantId = decoded.tenantId;

//         if (!dbConnections[tenantId]) {
//             const dbURI = getDatabaseURIForTenant(tenantId); // Fonction pour récupérer l'URI
//             dbConnections[tenantId] = mongoose.createConnection(dbURI);
//         }

//         req.tenantDb = dbConnections[tenantId]; // Attachez la DB au req
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Token invalide" });
//     }
// });
