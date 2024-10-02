import { Client } from "@gradio/client";
import fs from 'fs'; // Import the File System module in Node.js

// Async function to handle image generation and saving
async function generateAndSaveImage(pro) {
    try {
        const client = await Client.connect("projektkush/googleaisarvam");

        // Call the predict function with the prompt and model
        const result = await client.predict("/generate_image", {
            prompt: pro,
            model_name: "imagen-3.0-fast-generate-001",
        });

        // Assuming result.data[0] contains the base64 string of the image
        const base64Image = result.data; // Adjust index based on the API response structure
        const img_url = result.data[0].url;
        console.log(img_url);
        return img_url;

        // Decode the base64 string to binary data
        console.log(base64Image);
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Write the binary data to a file
        // fs.writeFile('output_image.png', imageBuffer, (err) => {
        //     if (err) throw err;
        //     console.log('Image saved as output_image.png');
        // });

    } catch (error) {
        console.error("Error generating and saving image:", error);
    }
}

const pro = "children"
generateAndSaveImage(pro);