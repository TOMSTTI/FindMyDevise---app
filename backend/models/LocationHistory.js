import mongoose from 'mongoose';

const locationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by user and time
locationHistorySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('LocationHistory', locationHistorySchema);
