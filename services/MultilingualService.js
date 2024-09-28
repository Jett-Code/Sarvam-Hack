const express = require('express');
const axios = require('axios');
const router = express.Router();

// before this convert mp4 video to mp3 then convert
// convert audio (mp3) to text then translate text to another language

router.post('/convert', async (req, res) => {

    const { audio, language } = req.body;
    const options = {method: 'POST', headers: {'Content-Type': 'multipart/form-data', 'API-Subscription-Key': process.env.SARVAM_API_KEY}, data: {audio, language}};
    
    try {
        const response = await axios.post('https://api.sarvam.ai/speech-to-text', options);
        res.json(response.data);
    } catch (error) {
        console.error('Error converting audio:', error);
        res.status(500).send('Error converting audio');
    }
});


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