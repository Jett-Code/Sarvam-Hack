const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
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
  const mp3Path = path.join("uploads", `${Date.now()}.mp4`);

  try {
    // Convert the video file to audio using the received video path
    await convertVideoToAudio(videoUrl, mp3Path);

    // Proceed with audio-to-text conversion and other services...
    const audio = fs.createReadStream(mp3Path);
    // const formData = new FormData();
    // formData.append("audio", audio);
    // formData.append("language", language);

    const form = new FormData();
    form.append("language_code", "hi-IN");
    form.append("model", "saarika:v1");
    form.append("file", audio);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
    };

    options.body = form;

    fetch("https://api.sarvam.ai/speech-to-text", options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        res.status(200).send(response);
      })
      .catch((err) => console.error(err));

    // const response = await axios.post("https://api.sarvam.ai/speech-to-text", {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     "api-subscription-key": process.env.SARVAM_API_KEY,
    //   },
    //   data: formData,
    // });

    // Clean up files after processing
    // fs.unlinkSync(videoUrl);
    // fs.unlinkSync(mp3Path);
  } catch (error) {
    console.error("Error converting video or processing audio:", error);
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
    console.error("Error translating text:", error);
    res.status(500).send("Error translating text");
  }
});

module.exports = router;
