const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// generate questions using gemini api with audio extracted from video
router.get('/quizzes', async (req, res) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "generate a set of quizzes based on the video content provided";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.send(result.response.text());
});

module.exports = router;