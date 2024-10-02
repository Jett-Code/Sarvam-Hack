const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const bucket = require("./firebase"); // Import the Firebase bucket
ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();

router.post("/addphoto", async (req, res) => {
  const { videoUrl, photoUrl, timestamp } = req.body;
  console.log(req.body);

  if (!videoUrl || !photoUrl || !timestamp) {
    return res
      .status(400)
      .send("Missing parameters: videoUrl, prompt, or timestamp");
  }

  // const photoUrl =
  //   "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSC-tzajqpca4dchoeTCp8ChzFqdXnSnKtpkbx_5arltgIZQDdV4ALDa2ojaIHmI0GE"; // Placeholder image URL
  const videoPath = path.resolve(videoUrl);
  const outputVideoPath = path.join("uploads", `${Date.now()}.mp4`);

  try {
    // Download the image from the photoUrl
    const response = await axios({ url: photoUrl, responseType: "stream" });
    const tempPhotoPath = path.resolve(__dirname, "temp_photo.jpg");

    const writer = fs.createWriteStream(tempPhotoPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      ffmpeg(videoPath)
        .input(tempPhotoPath)
        .inputOptions([`-itsoffset ${timestamp}`])
        .complexFilter([
          `[1:v]scale=620:620[image]`,
          `[0:v][image]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:enable='between(t,${timestamp},${
            Number(timestamp) + 1
          })'`,
        ])
        .output(outputVideoPath)
        .on("end", async () => {
          // Clean up the temporary image
          fs.unlinkSync(tempPhotoPath);

          // Upload the processed video to Firebase Storage
          try {
            await bucket.upload(outputVideoPath, {
              destination: `videos/${path.basename(outputVideoPath)}`,
              metadata: {
                contentType: "video/mp4",
              },
            });

            // Get the public URL of the uploaded video
            const videoDownloadLink = `https://firebasestorage.googleapis.com/v0/b/${
              bucket.name
            }/o/videos%2F${encodeURIComponent(
              path.basename(outputVideoPath)
            )}?alt=media`;

            res.status(200).json({
              message: "Added photo to video successfully",
              videoUrl: videoDownloadLink,
            });
          } catch (error) {
            console.error("Error uploading video to Firebase:", error);
            res.status(500).send("Error uploading video to Firebase");
          }
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
