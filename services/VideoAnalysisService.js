const express = require('express');
const axios = require('axios');
const router = express.Router();

// Example endpoint for video analysis
router.post('/analyze', async (req, res) => {
    const videoUrl = req.body.videoUrl;
    try {
        const response = await axios.post('https://gemini.api/video/analyze', {
            videoUrl,
            apiKey: process.env.GEMINI_API_KEY,
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error analyzing video:', error);
        res.status(500).send('Error analyzing video');
    }
});

module.exports = router;