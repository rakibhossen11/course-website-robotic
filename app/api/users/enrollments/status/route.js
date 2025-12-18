import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

export async function GET(request) {
  try {
    // Get user from session (you'll need to implement auth)
    const session = await getServerSession();
    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');

    const { db } = await connectToDatabase();

    let query = { userId };
    if (enrollmentId) {
      query._id = enrollmentId;
    }

    const enrollments = await db.collection('enrollments')
      .find(query)
      .sort({ enrolledAt: -1 })
      .toArray();

    // Check course access for approved enrollments
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        if (enrollment.status === 'approved') {
          const courseAccess = await db.collection('user_course_access')
            .findOne({ 
              userId: enrollment.userId, 
              courseId: enrollment.courseId 
            });
          return {
            ...enrollment,
            hasAccess: !!courseAccess
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
