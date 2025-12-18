import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userName: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  coursePrice: {
    type: Number,
    required: true,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['bkash', 'nagad', 'card']
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  paymentProof: {
    type: String, // Base64 string
    required: true
  },
  paymentProofType: {
    type: String,
    required: true
  },
  paymentProofName: {
    type: String,
    required: true
  },
  couponCode: {
    type: String,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'enrolledAt',
    updatedAt: 'lastUpdated' 
  }
});

// Create indexes
enrollmentSchema.index({ userId: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ transactionId: 1 }, { unique: true });

// Prevent model overwrite on hot reload
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;