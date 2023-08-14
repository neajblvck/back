// CHAT ROUTER

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const chatController = require('../controller/chat');


// Routes Fil de discussion
router.post('/threads', authMiddleware, chatController.createThread);
router.get ('/threads', chatController.getAllThread);
router.get('/threads/:id', chatController.getThreadById);
router.put('/threads/:id', authMiddleware, chatController.updateThread);
router.delete('/threads/:id', authMiddleware, chatController.deleteThread);


// Routes Commentaire
router.post('/comments/:id', authMiddleware, chatController.createComment);
router.get('/comments/:id', chatController.getCommentById);
router.put('/comments/:id', authMiddleware, chatController.updateComment);
router.delete('/comments/:id', authMiddleware, chatController.deleteComment);
 
module.exports = router;