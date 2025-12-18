import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const enrollmentData = await request.json();
    const { db } = await connectToDatabase();

    // Generate unique enrollment ID
    const enrollmentId = `ENR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Create enrollment document
    const enrollment = {
      _id: enrollmentId,
      ...enrollmentData,
      status: 'pending',
      enrolledAt: new Date(),
      lastUpdated: new Date()
    };

    // Insert into enrollments collection
    const result = await db.collection('enrollments').insertOne(enrollment);

    if (result.acknowledged) {
      // Send confirmation email to user
      await sendEmail({
        to: enrollmentData.userEmail,
        subject: `Enrollment Submitted - ${enrollmentData.courseName}`,
        template: 'enrollment-submitted',
        data: {
          userName: enrollmentData.userName,
          courseName: enrollmentData.courseName,
          enrollmentId: enrollmentId,
          amount: enrollmentData.finalAmount,
          transactionId: enrollmentData.transactionId,
          paymentMethod: enrollmentData.paymentMethod
        }
      });

      // Send notification to admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@learningbd.com',
        subject: `New Enrollment Request - ${enrollmentData.courseName}`,
        template: 'admin-enrollment-notification',
        data: {
          userName: enrollmentData.userName,
          userEmail: enrollmentData.userEmail,
          courseName: enrollmentData.courseName,
          amount: enrollmentData.finalAmount,
          transactionId: enrollmentData.transactionId,
          enrollmentId: enrollmentId,
          enrollmentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/enrollments/${enrollmentId}`
        }
      });

      return Response.json({
        success: true,
        enrollmentId: enrollmentId,
        message: 'Enrollment submitted successfully'
      });
    } else {
      throw new Error('Failed to save enrollment');
    }
  } catch (error) {
    console.error('Error submitting enrollment:', error);
    return Response.json({
      success: false,
      message: error.message || 'Failed to submit enrollment'
    }, { status: 500 });
  }
}