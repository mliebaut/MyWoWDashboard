require('dotenv').config();
const apiKey = process.env.BLIZZARD_API_KEY;
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Pour permettre les requêtes CORS

const app = express();
const port = 3000;

app.use(cors()); // Autorise les requêtes depuis n'importe quelle origine (tu peux restreindre si nécessaire)

app.get('/character', async (req, res) => {
  const { characterName, characterRealm, region } = req.query;

  // Vérification des paramètres
  if (!characterName || !characterRealm || !region) {
    return res.status(400).json({ error: 'Please provide characterName, characterRealm, and region.' });
  }

  const realmFormatted = characterRealm.toLowerCase().replace(/\s+/g, '-');
  const characterNameFormatted = characterName.toLowerCase().replace(/\s+/g, '-');

  // Définir namespace et locale en fonction de la région
  let namespace = '';
  let locale = '';

  switch (region) {
    case 'us':
      namespace = 'profile-us';
      locale = 'en_US';
      break;
    case 'eu':
      namespace = 'profile-eu';
      locale = 'en_GB';
      break;
    case 'kr':
      namespace = 'profile-kr';
      locale = 'ko_KR';
      break;
    case 'tw':
      namespace = 'profile-tw';
      locale = 'zh_TW';
      break;
    case 'cn':
      namespace = 'profile-cn';
      locale = 'zh_CN';
      break;
    default:
      return res.status(400).json({ error: 'Region not supported.' });
  }

  const url = `https://${region}.api.blizzard.com/profile/wow/character/${realmFormatted}/${characterNameFormatted}?namespace=${namespace}&locale=${locale}&access_token=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Vérification du statut de la réponse de l'API Blizzard
    if (response.status !== 200) {
      console.error('API Error:', response.status, response.statusText);
      return res.status(500).json({ error: 'Error retrieving character data from Blizzard.' });
    }

    // Si la réponse est correcte, renvoyer les données au frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching character data:', error.response ? error.response.data : error.message);

    // Afficher une erreur détaillée si l'API renvoie une réponse d'erreur
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'Error retrieving character data.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
