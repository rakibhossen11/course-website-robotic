// app/api/admin/courses/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const courses = await db.collection('courses').find({}).toArray();
    
    return Response.json({
      success: true,
      courses: courses
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch courses'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      title, 
      description, 
      price = 0, 
      students = 0, 
      duration = '', 
      instructor = '', 
      level = 'beginner', 
      category = 'web-development',
      featured = false 
    } = data;
    
    if (!title || !description) {
      return Response.json({
        success: false,
        message: 'Title and description are required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const courseData = {
      id: `course-${Date.now()}`,
      title,
      description,
      price: parseFloat(price),
      students: parseInt(students),
      duration,
      instructor,
      level,
      category,
      featured: Boolean(featured),
      modules: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('courses').insertOne(courseData);
    
    return Response.json({
      success: true,
      message: 'Course created successfully',
      courseId: courseData.id,
      course: courseData
    });
    
  } catch (error) {
    console.error('Error creating course:', error);
    return Response.json({
      success: false,
      message: 'Failed to create course'
    }, { status: 500 });
  }
}