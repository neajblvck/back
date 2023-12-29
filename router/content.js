// ROUTER CONTENT

const express = require('express');
const router = express.Router();

const contentCtrl = require('../controller/content');
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.patch('/updateStyle', authMiddleware, contentCtrl.updateStyle);
router.get('/getStyle', authMiddleware, contentCtrl.getStyle);

router.post('/', authMiddleware, multer, contentCtrl.createPost);
router.patch('/:id', authMiddleware, multer, contentCtrl.updatePost);
router.get('/', authMiddleware, contentCtrl.getContent);

router.post('/hero', authMiddleware, multer, contentCtrl.createHero);
router.patch('/hero/:id', authMiddleware, multer, contentCtrl.editHero);
router.get('/hero', authMiddleware, contentCtrl.getHero);


module.exports = router;