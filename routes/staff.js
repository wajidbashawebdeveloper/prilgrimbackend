
const express = require('express');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const LogoutRequest = require('../models/LogoutRequest');

const router = express.Router();

// ATTENDANCE: CLOCK IN
router.post('/clock-in', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      isClockedIn: true,
      lastLogin: new Date(),
      earlyLogoutPending: false
    }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Clock in failed' });
  }
});

// ATTENDANCE: REQUEST EARLY LOGOUT
router.post('/request-logout', async (req, res) => {
  const { userId, duration, reason } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newRequest = new LogoutRequest({
      userId,
      userName: user.name,
      duration,
      reason,
      status: 'PENDING'
    });
    await newRequest.save();
    
    // Set flag to lock employee panel
    await User.findByIdAndUpdate(userId, { earlyLogoutPending: true });
    res.json({ message: 'Early logout request submitted', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Request failed' });
  }
});

// LEAVES: APPLY
router.post('/leaves', async (req, res) => {
  try {
    const newLeave = new LeaveRequest({
        ...req.body,
        status: 'PENDING'
    });
    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (err) {
    res.status(400).json({ message: 'Application failed' });
  }
});

// LEAVES: GET USER LEAVES
router.get('/leaves/:userId', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// APPROVALS: GET ALL PENDING
router.get('/pending-requests', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'PENDING' }).sort({ createdAt: -1 });
    const logouts = await LogoutRequest.find({ status: 'PENDING' }).sort({ createdAt: -1 });
    res.json({ leaves, logouts });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// APPROVALS: UPDATE LEAVE STATUS
router.patch('/leaves/:id', async (req, res) => {
  try {
    const updated = await LeaveRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// APPROVALS: UPDATE LOGOUT REQUEST STATUS
router.patch('/logout-requests/:id', async (req, res) => {
  try {
    const request = await LogoutRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = req.body.status;
    await request.save();
    
    // Always clear the pending flag when a decision is made
    if (req.body.status === 'APPROVED' || req.body.status === 'REJECTED') {
      await User.findByIdAndUpdate(request.userId, { 
        isClockedIn: false, 
        earlyLogoutPending: false,
        lastLogout: new Date()
      });

      if (req.body.status === 'REJECTED') {
        // Record as LOP leave entry
        const rejectedLeave = new LeaveRequest({
          userId: request.userId,
          userName: request.userName,
          date: new Date(),
          reason: `Early logout REJECTED (Auto-LOP): ${request.reason}`,
          status: 'LOSS_OF_PAY'
        });
        await rejectedLeave.save();
      }
    }
    
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

module.exports = router;
