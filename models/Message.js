
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true, index: true }, // GroupID or PairID
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: String,
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
