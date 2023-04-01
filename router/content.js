// ROUTER CONTENT

const express = require('express');
const router = express.Router();

const contentCtrl = require('../controller/content');
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', multer, contentCtrl.createPost);
router.patch('/:id', multer, contentCtrl.postContent);
router.get('/', contentCtrl.getContent);


module.exports = router;