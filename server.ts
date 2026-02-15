import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import staffRoutes from './routes/staff';

const app = express();

// Middleware
// Casting to any to bypass strict typing issues between connect and express middleware types
app.use(cors() as any);
app.use(express.json() as any);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'Star Umrah API Running' }));

// MongoDB Connection
// In a real environment, MONGO_URI is handled via process.env
const MONGO_URI = 'mongodb://localhost:27017/starumrah';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to Star Umrah Database');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend service listening on port ${PORT}`);
});
