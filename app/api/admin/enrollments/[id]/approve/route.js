import connectToDatabase from '@/lib/mongoose';
import Enrollment from '@/models/Enrollment';
import UserCourseAccess from '@/models/UserCourseAccess';

export async function POST(request, { params }) {
  try {
    const enrollmentId = params.id;
    const { approved, adminNotes, reviewedBy } = await request.json();
    
    await connectToDatabase();
    
    // Find the enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    
    if (!enrollment) {
      return Response.json({
        success: false,
        message: 'Enrollment not found'
      }, { status: 404 });
    }
    
    // Update enrollment status
    enrollment.status = approved ? 'approved' : 'rejected';
    enrollment.reviewedAt = new Date();
    enrollment.adminNotes = adminNotes || null;
    enrollment.reviewedBy = reviewedBy || 'admin';
    
    await enrollment.save();
    
    // If approved, grant course access
    if (approved) {
      // Check if access already exists
      const existingAccess = await UserCourseAccess.findOne({
        userId: enrollment.userId,
        courseId: enrollment.courseId
      });
      
      if (!existingAccess) {
        // Create new access record
        const userCourseAccess = new UserCourseAccess({
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          enrollmentId: enrollmentId,
          accessGrantedAt: new Date(),
          expiresAt: null // Lifetime access
        });
        
        await userCourseAccess.save();
      }
    }
    
    // TODO: Send email to user about status update
    
    return Response.json({
      success: true,
      message: `Enrollment ${approved ? 'approved' : 'rejected'} successfully`
    });
    
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return Response.json({
      success: false,
      message: error.message || 'Failed to update enrollment'
    }, { status: 500 });
  }
}