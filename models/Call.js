
const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
  callerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  callerName: String,
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['VOICE', 'VIDEO'], default: 'VOICE' },
  status: { type: String, enum: ['RINGING', 'CONNECTED', 'REJECTED', 'ENDED'], default: 'RINGING' }
}, { timestamps: true });

module.exports = mongoose.model('Call', CallSchema);
