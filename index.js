require('dotenv').config();
const axios = require('axios').default;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const Video = require('./models/Video');
const VideoAnalysisService = require('./services/VideoAnalysisService');
const MultilingualService = require('./services/MultilingualService');
const DynamicContentService = require('./services/DynamicContentService');
const QuizService = require('./services/QuizService');
const FeedbackService = require('./services/FeedbackService');

const app = express();
app.use(cors());
app.use(express.json());

// File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.send('Server is running');
});


// Route to upload video
app.post('/api/upload', upload.single('video'), async (req, res) => {
    console.log('File uploaded:', req.file);
    const videoUrl = req.file.path;
     // Use the stored video path
    const videoTitle = req.body.title;

    try {
        // Save video information to the database
        const video = new Video({ title: videoTitle, url: videoUrl });
        await video.save();

        // Call all services
        const videoAnalysisResponse = await axios.post('http://localhost:3000/api/video-analysis/analyze', { videoUrl });
        const multilingualResponse = await axios.post('http://localhost:3000/api/multilingual/convert', { text: videoTitle, language: 'en' }); //not text but audio

        // Add more service calls as needed...

        res.json({
            message: 'Video processed successfully',
            videoAnalysis: videoAnalysisResponse.data,
            translation: multilingualResponse.data,
            // Include responses from other services
        });
    } catch (error) {
        console.error('Error during video processing:', error);
        res.status(500).send('Error processing video');
    }
});

// Define other services routes
app.use('/api/video-analysis', VideoAnalysisService);
app.use('/api/multilingual', MultilingualService);
app.use('/api/dynamic-content', DynamicContentService);
app.use('/api/quizzes', QuizService);
app.use('/api/feedback', FeedbackService);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});