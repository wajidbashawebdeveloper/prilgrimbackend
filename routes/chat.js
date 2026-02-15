
const express = require('express');
const Message = require('../models/Message');
const ChatGroup = require('../models/ChatGroup');
const User = require('../models/User');
const Call = require('../models/Call');
const router = express.Router();

// Get Messages for a specific chat
router.get('/messages/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Send a Message
router.post('/messages', async (req, res) => {
  const { chatId, senderId, senderName, content } = req.body;
  try {
    const newMessage = new Message({ chatId, senderId, senderName, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Send failed' });
  }
});

// Create a Group Chat
router.post('/groups', async (req, res) => {
  const { name, members, createdBy } = req.body;
  try {
    const newGroup = new ChatGroup({ name, members, createdBy });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ message: 'Group creation failed' });
  }
});

// Get Groups for a User
router.get('/groups/:userId', async (req, res) => {
  try {
    const groups = await ChatGroup.find({ members: req.params.userId }).sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Initiate a Call
router.post('/calls', async (req, res) => {
  const { callerId, receiverId, type } = req.body;
  try {
    const caller = await User.findById(callerId);
    const newCall = new Call({
      callerId,
      callerName: caller.name,
      receiverId,
      type,
      status: 'RINGING'
    });
    await newCall.save();
    res.status(201).json(newCall);
  } catch (err) {
    res.status(500).json({ message: 'Call init failed' });
  }
});

// Check Incoming Calls
router.get('/calls/incoming/:userId', async (req, res) => {
  try {
    const call = await Call.findOne({ 
      receiverId: req.params.userId, 
      status: 'RINGING',
      createdAt: { $gte: new Date(Date.now() - 30000) } // last 30 seconds
    }).sort({ createdAt: -1 });
    res.json(call);
  } catch (err) {
    res.status(500).json({ message: 'Check failed' });
  }
});

// Update Call Status
router.patch('/calls/:id', async (req, res) => {
  try {
    const updated = await Call.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
