
const express = require('express');
const Meeting = require('../models/Meeting');
const router = express.Router();

// Schedule Meeting
router.post('/', async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    res.status(500).json({ message: 'Meeting creation failed' });
  }
});

// Get Meetings for a User (Staff or Customer ID match)
router.get('/:userId', async (req, res) => {
  try {
    const meetings = await Meeting.find({ 
      $or: [
        { hostId: req.params.userId },
        { "participants.id": req.params.userId }
      ],
      startTime: { $gte: new Date(Date.now() - 86400000) } // Last 24 hours onwards
    }).sort({ startTime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

module.exports = router;
