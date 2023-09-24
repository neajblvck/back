// ROUTER CONTENT

const express = require('express');
const router = express.Router();

const contentCtrl = require('../controller/content');
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.patch('/updateStyle', authMiddleware, contentCtrl.updateStyle);
router.get('/getStyle', contentCtrl.getStyle);

router.post('/', authMiddleware, multer, contentCtrl.createPost);
router.patch('/:id', authMiddleware, multer, contentCtrl.postContent);
router.get('/', contentCtrl.getContent);

router.post('/hero', authMiddleware, multer, contentCtrl.createHero);
router.patch('/hero/:id', authMiddleware, multer, contentCtrl.postHero);
router.get('/hero', contentCtrl.getHero);


module.exports = router;