const newsService = require('../service/news.service');

function getNews(req, res) {
  newsService.getNews()
    .then(news => res.json(news))
    .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = {
  getNews,
};