
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  passportNumber: { type: String, required: true },
  passportExpiry: { type: Date, required: true },
  nationality: { type: String, default: 'Indian' },
  onboardTicket: String,
  returnTicket: String,
  visaNumber: String,
  visaExpiry: Date,
  ticketCost: { type: Number, default: 0 },
  visaCost: { type: Number, default: 0 },
  roomCost: { type: Number, default: 0 },
  foodCost: { type: Number, default: 0 },
  kitCost: { type: Number, default: 0 },
  packageAmount: { type: Number, required: true },
  balanceAmount: { type: Number, default: 0 },
  batch: { type: String, required: true },
  group: { type: String, required: true },
  assignedEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pilgrimCount: { type: Number, default: 1 },
  description: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Booked', 'Cancelled', 'Follow-up'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, default: 'Cash' }
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);
