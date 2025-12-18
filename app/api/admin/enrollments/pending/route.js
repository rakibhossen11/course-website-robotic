import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    // Get pending enrollments
    const enrollments = await db.collection('enrollments')
      .find({ status: 'pending' })
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await db.collection('enrollments')
      .countDocuments({ status: 'pending' });

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