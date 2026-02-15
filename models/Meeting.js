
const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  participants: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['STAFF', 'CUSTOMER'], required: true }
  }],
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hostName: String,
  status: { type: String, enum: ['SCHEDULED', 'ONGOING', 'COMPLETED'], default: 'SCHEDULED' }
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

module.exports = mongoose.model('Meeting', MeetingSchema);
