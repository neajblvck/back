const axios = require('axios');


const API_KEY = process.env.NEWS_API_KEY;
const country = 'fr'

async function getNews() {
    try {
        const response = await axios.get(
            `http://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`
            
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('impossible de récupérer l\'actualité');
    }
}

module.exports = {
    getNews,
};