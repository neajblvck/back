const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;


const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=Paris`;

async function getWeather(city) {
  try {
    const response = await axios.get(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch weather');
  }
}

module.exports = {
  getWeather,
};



