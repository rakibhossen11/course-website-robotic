import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: String,
  url: String,
  duration: String,
  freePreview: Boolean,
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  videos: [VideoSchema],
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: Number,
  category: String,
  thumbnail: String,
  modules: [ModuleSchema],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  rating: {
    type: Number,
    default: 0,
  },
  totalHours: Number,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);