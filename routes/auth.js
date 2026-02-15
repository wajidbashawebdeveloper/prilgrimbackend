
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Get Staff Status (for lock screen checks)
router.get('/staff-status/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('earlyLogoutPending isClockedIn');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Status fetch failed' });
  }
});

// Get All Staff
router.get('/staff', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'ADMIN' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Delete Staff
router.delete('/staff/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Update Staff
router.patch('/staff/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Account not recognized' });

    // Handle dummy reauth for session lock check
    if (password === 'DUMMY_REAUTH') {
       return res.json({ user });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'star-umrah-secret-key', { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Staff
router.post('/register', async (req, res) => {
  const { name, email, password, role, target } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, email, password: hashedPassword, role, target: Number(target) || 0 
    });
    await newUser.save();
    res.status(201).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Failed' });
  }
});

module.exports = router;
