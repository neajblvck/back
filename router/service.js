const express = require('express');
const router = express.Router();
const weatherController = require('../controller/weatherController');
const newsController = require('../controller/newsController')

router.get('/weather/:city', weatherController.getWeather);
router.get('/news', newsController.getNews);

module.exports = router;
