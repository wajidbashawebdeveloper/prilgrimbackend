
import express from 'express';
import User from '../models/User';
import LeaveRequest from '../models/LeaveRequest';
import LogoutRequest from '../models/LogoutRequest';

const router = express.Router();

// Clock In
router.post('/clock-in', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      isClockedIn: true,
      lastLogin: new Date(),
      earlyLogoutPending: false
    }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Clock in failed' });
  }
});

// Request Early Logout
router.post('/request-logout', async (req, res) => {
  const { userId, duration, reason } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newRequest = new LogoutRequest({
      userId,
      userName: user.name,
      duration,
      reason
    });
    await newRequest.save();
    
    await User.findByIdAndUpdate(userId, { earlyLogoutPending: true });
    res.json({ message: 'Request sent to management', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Request failed' });
  }
});

// Leave Applications
router.post('/leaves', async (req, res) => {
  try {
    const newLeave = new LeaveRequest(req.body);
    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (err) {
    res.status(400).json({ message: 'Application failed' });
  }
});

// Get all pending requests (Management Only)
router.get('/pending-requests', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'PENDING' });
    const logouts = await LogoutRequest.find({ status: 'PENDING' });
    res.json({ leaves, logouts });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Update Leave Status
router.patch('/leaves/:id', async (req, res) => {
  try {
    const updated = await LeaveRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

export default router;
