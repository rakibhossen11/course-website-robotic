import { connectToDatabase } from '@/lib/mongodb';
import { sendEnrollmentApproval, sendEnrollmentRejection } from '@/lib/email-service';

export async function POST(request, { params }) {
  try {
    // Await the params promise first
    const { id } = await params;
    console.log('get path name ', id);
    
    const { action, adminNotes, processedBy } = await request.json();
    
    if (!['approve', 'reject'].includes(action)) {
      return Response.json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject".'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Find the enrollment
    const enrollment = await db.collection('enrollments').findOne({ _id: id });
    
    if (!enrollment) {
      return Response.json({
        success: false,
        message: 'Enrollment not found'
      }, { status: 404 });
    }
    
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Update enrollment
    const updateResult = await db.collection('enrollments').updateOne(
      { _id: id },
      {
        $set: {
          status: newStatus,
          adminNotes: adminNotes || null,
          reviewedAt: new Date(),
          reviewedBy: processedBy || 'admin',
          lastUpdated: new Date()
        }
      }
    );
    
    if (updateResult.modifiedCount === 1) {
      // Send email notification
      try {
        if (process.env.EMAIL_ENABLED === 'true') {
          const emailData = {
            enrollmentId: id,
            transactionId: enrollment.transactionId,
            courseName: enrollment.courseName,
            userName: enrollment.userName,
            finalAmount: enrollment.finalAmount,
            paymentMethod: enrollment.paymentMethod,
            status: newStatus,
            reason: adminNotes
          };
          
          if (action === 'approve') {
            await sendEnrollmentApproval(enrollment.userEmail, emailData);
          } else {
            await sendEnrollmentRejection(enrollment.userEmail, emailData);
          }
          
          // Update email status in enrollment
          await db.collection('enrollments').updateOne(
            { _id: id },
            { $set: { emailSent: true, emailSentAt: new Date() } }
          );
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
        // Continue even if email fails
      }
      
      return Response.json({
        success: true,
        message: `Enrollment ${newStatus} successfully`,
        enrollmentId: id,
        newStatus: newStatus
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to update enrollment'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error processing enrollment:', error);
    
    // Return success for demo purposes even if database fails
    return Response.json({
      success: false,
      message: `Error processing enrollment: ${error.message}`,
      enrollmentId: (await params)?.id || 'unknown',
      newStatus: 'error'
    }, { status: 500 });
  }
}