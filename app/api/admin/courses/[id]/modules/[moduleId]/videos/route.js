// app/api/admin/courses/[id]/modules/[moduleId]/videos/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    // Use [id] instead of [courseId]
    const { id: courseId, moduleId } = await params;
    const { videoId, title, duration, free = false } = await request.json();
    
    if (!videoId || !title || !duration) {
      return Response.json({
        success: false,
        message: 'Video ID, title, and duration are required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Check if course and module exist
    const course = await db.collection('courses').findOne({ 
      id: courseId,
      'modules.id': moduleId 
    });
    
    if (!course) {
      return Response.json({
        success: false,
        message: 'Course or module not found'
      }, { status: 404 });
    }
    
    const videoData = {
      id: videoId,
      title,
      duration,
      free: Boolean(free),
      order: (course.modules?.find(m => m.id === moduleId)?.videos?.length || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('courses').updateOne(
      { id: courseId, 'modules.id': moduleId },
      { 
        $push: { 'modules.$.videos': videoData },
        $set: { 
          'modules.$.updatedAt': new Date(),
          updatedAt: new Date() 
        }
      }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Video added successfully',
        video: videoData
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to add video'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error adding video:', error);
    return Response.json({
      success: false,
      message: 'Failed to add video'
    }, { status: 500 });
  }
}