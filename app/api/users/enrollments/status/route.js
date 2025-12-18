import { connectToDatabase } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import UserCourseAccess from '@/models/UserCourseAccess';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const enrollmentId = searchParams.get('enrollmentId');
    
    if (!userId) {
      return Response.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    // Build query
    const query = { userId };
    if (enrollmentId) {
      query._id = enrollmentId;
    }
    
    // Get user's enrollments
    const enrollments = await Enrollment.find(query)
      .sort({ enrolledAt: -1 })
      .lean();
    
    // Check course access for each enrollment
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        if (enrollment.status === 'approved') {
          const courseAccess = await UserCourseAccess.findOne({
            userId: enrollment.userId,
            courseId: enrollment.courseId
          });
          
          return {
            ...enrollment,
            hasAccess: !!courseAccess,
            accessGrantedAt: courseAccess?.accessGrantedAt || null
          };
        }
        return enrollment;
      })
    );
    
    return Response.json({
      success: true,
      enrollments: enrichedEnrollments
    });
    
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch enrollments'
    }, { status: 500 });
  }
}