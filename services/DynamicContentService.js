const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const router = express.Router();
const img = require("Images")

// Endpoint to get dynamic content
router.get("/content", (req, res) => {
  // Placeholder logic for fetching dynamic content
  res.send("Dynamic content would be served here");
});

//prompt to generate and image,
router.post("/addphoto", async (req, res) => {
  const { videoUrl, prompt, timestamp } = req.body;
  console.log(videoUrl);
  if (!videoUrl || !prompt || !timestamp) {
    return res
      .status(400)
      .send("Missing parameters: videoUrl, prompt, or timestamp");
  }

  // const photoUrl =  img.generateAndSaveImage(prompt);
  const photoUrl =
    "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSC-tzajqpca4dchoeTCp8ChzFqdXnSnKtpkbx_5arltgIZQDdV4ALDa2ojaIHmI0GE";
  const videoPath = path.resolve(videoUrl);
  const outputVideoPath = path.join("uploads", `${Date.now()}.mp4`);
  console.log(videoPath);
  // Check if video exists
  //   if (!fs.existsSync(videoPath)) {
  //     return res.status(404).send("Video not found");
  //   }

  try {
    // Download the image from the photoUrl
    const response = await axios({
      url: photoUrl,
      responseType: "stream",
    });

    const tempPhotoPath = path.resolve(__dirname, "temp_photo.jpg");

    // Save the downloaded image to a temporary location
    const writer = fs.createWriteStream(tempPhotoPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      // Process the video with the downloaded image
      ffmpeg(videoPath)
        .input(tempPhotoPath)
        .inputOptions([`-itsoffset ${timestamp}`]) // Offset image to timestamp
        // Overlay the image for 1 second, using 't' to define the duration
        .complexFilter([
          `[1:v]scale=620:620[image]`,
          `[0:v][image]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:enable='between(t,${timestamp},${
            Number(timestamp) + 1
          })'`,
        ])
        .output(outputVideoPath)
        .on("end", () => {
          // Clean up the temporary image
          fs.unlinkSync(tempPhotoPath);
          res.status(200).send("Added Photo to Video successfully");
        })
        .on("error", (err) => {
          console.error(err);
          res.status(500).send("Error processing video");
        })
        .run();
    });

    writer.on("error", (err) => {
      console.error(err);
      res.status(500).send("Error downloading photo");
    });
  } catch (error) {
    console.error("Error downloading the photo:", error);
    return res.status(500).send("Failed to download photo from URL");
  }
});

module.exports = router;
