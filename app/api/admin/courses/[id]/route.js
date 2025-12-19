// app/api/admin/courses/[id]/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    const course = await db.collection('courses').findOne({ id });
    
    if (!course) {
      return Response.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      course: course
    });
    
  } catch (error) {
    console.error('Error fetching course:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch course'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { 
      title, 
      description, 
      price, 
      students, 
      duration, 
      instructor, 
      level, 
      category,
      featured,
      status 
    } = data;
    
    const { db } = await connectToDatabase();
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (students !== undefined) updateData.students = parseInt(students);
    if (duration !== undefined) updateData.duration = duration;
    if (instructor !== undefined) updateData.instructor = instructor;
    if (level !== undefined) updateData.level = level;
    if (category !== undefined) updateData.category = category;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (status !== undefined) updateData.status = status;
    
    updateData.updatedAt = new Date();
    
    const result = await db.collection('courses').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 1) {
      return Response.json({
        success: true,
        message: 'Course updated successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error updating course:', error);
    return Response.json({
      success: false,
      message: 'Failed to update course'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    const result = await db.collection('courses').deleteOne({ id });
    
    if (result.deletedCount === 1) {
      return Response.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error deleting course:', error);
    return Response.json({
      success: false,
      message: 'Failed to delete course'
    }, { status: 500 });
  }
}