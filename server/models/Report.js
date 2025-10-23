const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  }
});

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: locationSchema,
    required: [true, 'Location is required']
  },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'Collected'],
    default: 'Reported'
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  verificationCount: {
    type: Number,
    default: 0,
    min: [0, 'Verification count cannot be negative']
  },
  verifiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better query performance
reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1 });
reportSchema.index({ reporter: 1 });

// Virtual for verification threshold
reportSchema.virtual('isVerified').get(function() {
  return this.verificationCount >= 3;
});

// Method to add verification
reportSchema.methods.addVerification = function(userId) {
  if (!this.verifiedBy.includes(userId)) {
    this.verifiedBy.push(userId);
    this.verificationCount += 1;
    
    // Auto-verify if threshold reached
    if (this.verificationCount >= 3 && this.status === 'Reported') {
      this.status = 'Verified';
    }
  }
  return this.save();
};

module.exports = mongoose.model('Report', reportSchema);
