import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    // Get all enrollments sorted by date
    const enrollments = await db.collection('enrollments')
      .find({})
      .sort({ enrolledAt: -1 })
      .toArray();
    
    return Response.json({
      success: true,
      enrollments: enrollments,
      count: enrollments.length
    });
    
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch enrollments'
    }, { status: 500 });
  }
}