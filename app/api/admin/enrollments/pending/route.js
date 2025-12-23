import { connectToDatabase } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get pending enrollments with pagination
    const enrollments = await Enrollment.find({ status: 'pending' })
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await Enrollment.countDocuments({ status: 'pending' });
    
    return Response.json({
      success: true,
      enrollments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching pending enrollments:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch enrollments'
    }, { status: 500 });
  }
}