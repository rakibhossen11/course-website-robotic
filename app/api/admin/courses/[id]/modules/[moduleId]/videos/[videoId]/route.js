// app/api/admin/courses/[id]/modules/[moduleId]/videos/[videoId]/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request, { params }) {
  try {
    // Use [id] instead of [courseId]
    const { id: courseId, moduleId, videoId } = await params;
    const { title, duration, free } = await request.json();
    
    if (!title || !duration) {
      return Response.json({
        success: false,
        message: 'Video title and duration are required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const updateData = {};
    if (title !== undefined) updateData['modules.$[module].videos.$[video].title'] = title;
    if (duration !== undefined) updateData['modules.$[module].videos.$[video].duration'] = duration;
    if (free !== undefined) updateData['modules.$[module].videos.$[video].free'] = Boolean(free);
    updateData['modules.$[module].videos.$[video].updatedAt'] = new Date();
    updateData['modules.$[module].updatedAt'] = new Date();
    updateData.updatedAt = new Date();
    
    const result = await db.collection('courses').updateOne(
      { id: courseId },
      { 
        $set: updateData
      },
      {
        arrayFilters: [
          { 'module.id': moduleId },
          { 'video.id': videoId }
        ]
      }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Video updated successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Video not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error updating video:', error);
    return Response.json({
      success: false,
      message: 'Failed to update video'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Use [id] instead of [courseId]
    const { id: courseId, moduleId, videoId } = await params;
    const { db } = await connectToDatabase();
    
    const result = await db.collection('courses').updateOne(
      { id: courseId, 'modules.id': moduleId },
      { 
        $pull: { 'modules.$.videos': { id: videoId } },
        $set: { 
          'modules.$.updatedAt': new Date(),
          updatedAt: new Date() 
        }
      }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Video deleted successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Video not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error deleting video:', error);
    return Response.json({
      success: false,
      message: 'Failed to delete video'
    }, { status: 500 });
  }
}