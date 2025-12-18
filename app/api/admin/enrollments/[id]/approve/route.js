import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';

export async function POST(request, { params }) {
  try {
    const enrollmentId = params.id;
    const { approved, adminNotes } = await request.json();
    const { db } = await connectToDatabase();

    // Find the enrollment
    const enrollment = await db.collection('enrollments').findOne({ _id: enrollmentId });

    if (!enrollment) {
      return Response.json({
        success: false,
        message: 'Enrollment not found'
      }, { status: 404 });
    }

    const newStatus = approved ? 'approved' : 'rejected';

    // Update enrollment status
    const updateResult = await db.collection('enrollments').updateOne(
      { _id: enrollmentId },
      {
        $set: {
          status: newStatus,
          reviewedAt: new Date(),
          adminNotes: adminNotes || null,
          lastUpdated: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 1) {
      // If approved, grant course access
      if (approved) {
        await db.collection('user_course_access').insertOne({
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          enrollmentId: enrollmentId,
          accessGrantedAt: new Date(),
          expiresAt: null, // Lifetime access
          lastAccessed: null
        });
      }

      // Send email to user
      await sendEmail({
        to: enrollment.userEmail,
        subject: `Enrollment ${newStatus === 'approved' ? 'Approved' : 'Rejected'} - ${enrollment.courseName}`,
        template: `enrollment-${newStatus}`,
        data: {
          userName: enrollment.userName,
          courseName: enrollment.courseName,
          enrollmentId: enrollmentId,
          status: newStatus,
          adminNotes: adminNotes,
          courseLink: newStatus === 'approved' ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses/${enrollment.courseId}` : null
        }
      });

      return Response.json({
        success: true,
        message: `Enrollment ${newStatus} successfully`
      });
    } else {
      throw new Error('Failed to update enrollment');
    }
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return Response.json({
      success: false,
      message: error.message || 'Failed to update enrollment'
    }, { status: 500 });
  }
}