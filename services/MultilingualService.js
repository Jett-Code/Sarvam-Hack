const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const request = require("request");
ffmpeg.setFfmpegPath(ffmpegPath);
const router = express.Router();

// Convert MP4 video to MP3
const convertVideoToAudio = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp3")
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
};
// before this convert mp4 video to mp3 then convert
// convert audio (mp3) to text then translate text to another language
router.post("/convert", async (req, res) => {
  const { videoUrl, language } = req.body;
  const mp3Path = path.join("uploads", `${Date.now()}.mp3`);

  try {
    // Convert the video file to audio using the received video path
    await convertVideoToAudio(videoUrl, mp3Path);

    const form = new FormData();
    form.append("language_code", "hi-IN");
    form.append("model", "saarika:v1");

    form.append("file", fs.createReadStream(mp3Path));

    const formData = {
      language_code: "hi-IN",
      model: "saarika:v1",
      file: fs.createReadStream(mp3Path),
    };

    request.post(
      {
        url: "https://api.sarvam.ai/speech-to-text",
        formData: formData,
        headers: { "api-subscription-key": process.env.SARVAM_API_KEY },
      },
      function (err, httpResponse, body) {
        console.log(httpResponse);
        if (err) {
          return console.error("Upload failed:", err);
        }
        console.log("Server responded with:", body);
        res.status(200).send(body);
      }
    );
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error converting video or processing audio");
  }
});

router.post("/translate", async (req, res) => {
  const { text, language } = req.body;
  try {
    const response = await axios.post("https://sarvam.api/translate", {
      text,
      language,
      apiKey: process.env.SARVAM_API_KEY,
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error translating text");
  }
});

module.exports = router;
