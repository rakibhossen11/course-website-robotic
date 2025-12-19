// app/api/admin/courses/[id]/modules/[moduleId]/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request, { params }) {
  try {
    // Use [id] instead of [courseId]
    const { id: courseId, moduleId } = await params;
    const { title, description } = await request.json();
    
    if (!title) {
      return Response.json({
        success: false,
        message: 'Module title is required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const updateData = {};
    if (title !== undefined) updateData['modules.$.title'] = title;
    if (description !== undefined) updateData['modules.$.description'] = description;
    updateData['modules.$.updatedAt'] = new Date();
    updateData.updatedAt = new Date();
    
    const result = await db.collection('courses').updateOne(
      { id: courseId, 'modules.id': moduleId },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Module updated successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Module not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error updating module:', error);
    return Response.json({
      success: false,
      message: 'Failed to update module'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Use [id] instead of [courseId]
    const { id: courseId, moduleId } = await params;
    const { db } = await connectToDatabase();
    
    const result = await db.collection('courses').updateOne(
      { id: courseId },
      { 
        $pull: { modules: { id: moduleId } },
        $set: { updatedAt: new Date() }
      }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Module deleted successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Module not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error deleting module:', error);
    return Response.json({
      success: false,
      message: 'Failed to delete module'
    }, { status: 500 });
  }
}