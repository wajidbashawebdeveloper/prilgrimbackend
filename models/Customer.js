
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  passportNumber: { type: String, required: true },
  passportExpiry: { type: Date, required: true },
  nationality: { type: String, default: 'Indian' },
  onboardTicket: { type: String, default: '' },
  returnTicket: { type: String, default: '' },
  visaNumber: { type: String, default: '' },
  visaExpiry: { type: Date },
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
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Booked', 'Cancelled', 'Follow-up'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, default: 'Cash' }
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
