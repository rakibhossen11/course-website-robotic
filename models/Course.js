import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  savings: {
    type: Number,
    default: 0,
    min: 0
  },
  features: [{
    type: String,
    required: true
  }],
  bonuses: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  bestValue: {
    type: Boolean,
    default: false
  },
  guarantee: {
    type: String,
    default: '30-day money-back guarantee'
  },
  videoCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: 'Lifetime access'
  }
}, {
  timestamps: true
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;