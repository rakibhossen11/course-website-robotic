import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  purchasedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);