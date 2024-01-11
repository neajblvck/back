// /routes/sseRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto');





router.get('/', async (req, res) => {
    const sseManager = req.app.get('sseManager');
    
    /* Notre route étant publique nous n'avons pas l'identité de l'utilisateur,
       nous générons donc un identifiant aléatoirement
     */
    const id = crypto.randomBytes(16).toString('hex');
   
    /* On ouvre la connexion avec notre client */
    sseManager.open(id, res);
   
    /* On envoie le nombre de clients connectés à l'ensemble des clients */
    sseManager.broadcast({
      id: Date.now(),
      type: 'count',
      data: sseManager.count()
    });

    /* en cas de fermeture de la connexion, on supprime le client de notre manager */
    req.on('close', () => {
  /* En cas de deconnexion on supprime le client de notre manager */
      sseManager.delete(id);
      /* On envoie le nouveau nombre de clients connectés */
      sseManager.broadcast({
        id: Date.now(),
        type: 'count',
        data: sseManager.count()
      });
    });
  });


module.exports = router;

