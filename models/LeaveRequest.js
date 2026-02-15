
const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'LOSS_OF_PAY'], 
    default: 'PENDING' 
  }
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

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
