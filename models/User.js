import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastAccessed: Date,
  currentVideoId: String,
});

const UserSchema = new mongoose.Schema({
  // Firebase UID instead of email as unique identifier
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  enrolledCourses: [EnrollmentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  subscription: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
  },
  // Firebase-specific fields
  provider: String,
  emailVerified: Boolean,
  phoneNumber: String,
});

// Method to check enrollment
UserSchema.methods.isEnrolledInCourse = function(courseId) {
  return this.enrolledCourses.some(enrollment => 
    enrollment.courseId.toString() === courseId.toString()
  );
};

// Method to get enrollment
UserSchema.methods.getEnrollment = function(courseId) {
  return this.enrolledCourses.find(enrollment => 
    enrollment.courseId.toString() === courseId.toString()
  );
};

export default mongoose.models.User || mongoose.model('User', UserSchema);