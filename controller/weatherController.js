const weatherService = require('../service/weatherService');

function getWeather(req, res) {
  const city = req.params.city;
  weatherService.getWeather(city)
    .then(weather => res.json(weather))
    .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = {
  getWeather,
};