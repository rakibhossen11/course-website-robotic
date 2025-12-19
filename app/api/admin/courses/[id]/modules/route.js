// app/api/admin/courses/[id]/modules/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    // Use [id] instead of [courseId]
    const { id: courseId } = await params;
    const { title, description = '' } = await request.json();
    
    if (!title) {
      return Response.json({
        success: false,
        message: 'Module title is required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Check if course exists
    const course = await db.collection('courses').findOne({ id: courseId });
    if (!course) {
      return Response.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
    const moduleData = {
      id: `module-${Date.now()}`,
      title,
      description,
      videos: [],
      order: (course.modules?.length || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('courses').updateOne(
      { id: courseId },
      { 
        $push: { modules: moduleData },
        $set: { updatedAt: new Date() }
      }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Module created successfully',
        moduleId: moduleData.id,
        module: moduleData
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to create module'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error creating module:', error);
    return Response.json({
      success: false,
      message: 'Failed to create module'
    }, { status: 500 });
  }
}