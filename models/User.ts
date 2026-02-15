
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'SUB_ADMIN', 'EMPLOYEE'], 
    default: 'EMPLOYEE' 
  },
  target: { type: Number, default: 0 },
  bookedCount: { type: Number, default: 0 },
  isClockedIn: { type: Boolean, default: false },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  totalWorkHours: { type: Number, default: 0 },
  earlyLogoutPending: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
