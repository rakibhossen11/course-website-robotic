// app/api/admin/modules/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const modules = await db.collection('modules').find({}).toArray();
    
    return Response.json({
      success: true,
      modules: modules
    });
    
  } catch (error) {
    console.error('Error fetching modules:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch modules'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title } = await request.json();
    
    if (!title) {
      return Response.json({
        success: false,
        message: 'Module title is required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const moduleData = {
      id: `module-${Date.now()}`,
      title,
      videos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('modules').insertOne(moduleData);
    
    return Response.json({
      success: true,
      message: 'Module created successfully',
      moduleId: moduleData.id,
      module: moduleData
    });
    
  } catch (error) {
    console.error('Error creating module:', error);
    return Response.json({
      success: false,
      message: 'Failed to create module'
    }, { status: 500 });
  }
}
