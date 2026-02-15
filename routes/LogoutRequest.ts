
import mongoose from 'mongoose';

const LogoutRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  requestTime: { type: Date, default: Date.now },
  duration: Number, // duration in minutes worked so far
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  reason: String
}, { timestamps: true });

export default mongoose.model('LogoutRequest', LogoutRequestSchema);
