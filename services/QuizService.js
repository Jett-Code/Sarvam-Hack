const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// generate questions using gemini api with audio extracted from video
router.post("/", async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `generate a set of quizzes based on the topics mentioned in this text "${req.body.transcript}", ignore any personal information:  `;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());

  res.status(200).send({ result: result.response.text() });
});

module.exports = router;
