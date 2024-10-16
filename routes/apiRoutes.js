const express = require('express');
const axios = require('axios');
const router = express.Router();

const MAL_TOKEN = 'https://myanimelist.net/v1/oauth2';

const fetchMALData = async (endpoint) => {
    try {
      const response = await axios.get(`https://api.myanimelist.net/v2${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${MAL_TOKEN}`,
        },
        params: {
          limit: 10
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados da API do MyAnimeList:', error);
      return null;
    }
  };

// Rota para buscar os animes mais populares
router.get('/api/animes-populares', async (req, res) =>{
    const data = await fetchMALData('/anime/ranking?ranking_type=bypopularity');
    res.json(data.data || []);
});
  
// Rota para buscar os top animes atualmente exibidos
router.get('/api/top-current-animes', async (req, res) =>{
    const data = await fetchMALData('/anime/ranking?ranking_type=airing');
    res.json(data.data || []);
});

// Rota para buscar os animes mais esperados
router.get('/api/upcoming-animes', async (req, res) =>{
    const data = await fetchMALData('/anime/ranking?ranking_type=upcoming');
    res.json(data.data || []);
});
  
module.exports = router;