// app/api/admin/modules/[id]/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title } = await request.json();
    
    if (!title) {
      return Response.json({
        success: false,
        message: 'Module title is required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection('modules').updateOne(
      { id },
      { $set: { title, updatedAt: new Date() } }
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
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    const result = await db.collection('modules').deleteOne({ id });
    
    if (result.deletedCount === 1) {
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