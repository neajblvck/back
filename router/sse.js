// /routes/sseRoutes.js

const express = require('express');
const router = express.Router();
const sseManager = require('../utils/sseManager');
const authMiddleware = require('../middleware/auth');



router.get('/events', (req, res) => {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sessionId = req.sessionID
    sseManager.addClient(res, sessionId);

    req.on('close', () => {
        sseManager.removeClient(res);
    });if (req.signedCookies) {
        console.log('Cookies signés: ', req.signedCookies);
    }
});

module.exports = router;
