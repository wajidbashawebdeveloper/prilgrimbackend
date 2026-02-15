
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const staffRoutes = require('./routes/staff');
const chatRoutes = require('./routes/chat');
const meetingRoutes = require('./routes/meetings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/meetings', meetingRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'Star Umrah API Active' }));

// Initial Database Seeding
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@starumrah.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@starumrah.com',
        password: hashedPassword,
        role: 'ADMIN',
        target: 0,
        isClockedIn: false
      });
      await admin.save();
      console.log('--- ADMIN SEEDED: admin@starumrah.com / admin123 ---');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://dbone:dbone@starumrah.ddzxlyg.mongodb.net/starumrah';
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB: Connected to Star Umrah Database');
    await seedAdmin();
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Star Umrah CRM Backend running on port ${PORT}`);
});
