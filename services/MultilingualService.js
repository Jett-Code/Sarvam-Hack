const express = require('express');
const axios = require('axios');
const router = express.Router();

// Example endpoint for translation
router.post('/translate', async (req, res) => {
    const { text, language } = req.body;
    try {
        const response = await axios.post('https://sarvam.api/translate', {
            text,
            language,
            apiKey: process.env.SARVAM_API_KEY,
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).send('Error translating text');
    }
});

module.exports = router;