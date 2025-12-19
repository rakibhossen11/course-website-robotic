// app/api/admin/modules/[id]/videos/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    const { id: moduleId } = await params;
    const { videoId, title, duration, free } = await request.json();
    
    if (!videoId || !title || !duration) {
      return Response.json({
        success: false,
        message: 'Video ID, title, and duration are required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Check if module exists
    const module = await db.collection('modules').findOne({ id: moduleId });
    if (!module) {
      return Response.json({
        success: false,
        message: 'Module not found'
      }, { status: 404 });
    }
    
    // Create video object
    const video = {
      id: videoId,
      title,
      duration,
      free: free || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add video to module
    const result = await db.collection('modules').updateOne(
      { id: moduleId },
      { $push: { videos: video } }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Video added successfully',
        video: video
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