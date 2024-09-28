const express = require('express');
const router = express.Router();

// Endpoint to submit feedback
router.post('/submit', (req, res) => {
    const feedback = req.body.feedback;
    // Placeholder logic for saving feedback
    res.send('Feedback submitted successfully');
});

module.exports = router;