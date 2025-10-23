const mongoose = require('mongoose');

const rewardLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  type: {
    type: String,
    enum: ['Reported', 'Verified', 'Collected'],
    required: [true, 'Reward type is required']
  },
  pointsAwarded: {
    type: Number,
    required: [true, 'Points awarded is required'],
    min: [0, 'Points awarded cannot be negative']
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: [true, 'Report is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
rewardLogSchema.index({ user: 1, timestamp: -1 });
rewardLogSchema.index({ report: 1 });

// Static method to create reward log
rewardLogSchema.statics.createReward = async function(userId, type, points, reportId, description = '') {
  const rewardLog = new this({
    user: userId,
    type,
    pointsAwarded: points,
    report: reportId,
    description
  });
  
  return await rewardLog.save();
};

module.exports = mongoose.model('RewardLog', rewardLogSchema);
