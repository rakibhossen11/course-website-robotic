import { connectToDatabase } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

export async function POST(request) {
  try {
    const enrollmentData = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Validate required fields
    const requiredFields = ['userId', 'userEmail', 'courseId', 'transactionId', 'phoneNumber', 'paymentProof'];
    for (const field of requiredFields) {
      if (!enrollmentData[field]) {
        return Response.json({
          success: false,
          message: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }
    
    // Check if course exists
    const course = await Course.findById(enrollmentData.courseId);
    if (!course) {
      return Response.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
    // Check if transaction ID already exists
    const existingEnrollment = await Enrollment.findOne({ 
      transactionId: enrollmentData.transactionId 
    });
    
    if (existingEnrollment) {
      return Response.json({
        success: false,
        message: 'Transaction ID already used. Please use a different transaction ID.'
      }, { status: 400 });
    }
    
    // Generate unique enrollment ID
    const enrollmentId = `ENR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    // Create enrollment
    const enrollment = new Enrollment({
      _id: enrollmentId,
      userId: enrollmentData.userId,
      userEmail: enrollmentData.userEmail,
      userName: enrollmentData.userName || enrollmentData.userEmail.split('@')[0],
      courseId: enrollmentData.courseId,
      courseName: course.name,
      coursePrice: course.price,
      finalAmount: enrollmentData.finalAmount || course.price,
      paymentMethod: enrollmentData.paymentMethod || 'bkash',
      transactionId: enrollmentData.transactionId,
      phoneNumber: enrollmentData.phoneNumber,
      paymentProof: enrollmentData.paymentProof,
      paymentProofType: enrollmentData.paymentProofType || 'image/png',
      paymentProofName: enrollmentData.paymentProofName || 'payment_proof.png',
      couponCode: enrollmentData.couponCode || null,
      discountAmount: enrollmentData.discountAmount || 0,
      status: 'pending'
    });
    
    // Save enrollment
    await enrollment.save();
    
    // TODO: Send email notification (implement email service)
    console.log('Enrollment saved successfully:', enrollmentId);
    
    return Response.json({
      success: true,
      enrollmentId: enrollmentId,
      message: 'Enrollment submitted successfully. Please wait for admin approval.'
    });
    
  } catch (error) {
    console.error('Error submitting enrollment:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return Response.json({
        success: false,
        message: 'Duplicate transaction ID or enrollment ID'
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      message: error.message || 'Failed to submit enrollment'
    }, { status: 500 });
  }
}