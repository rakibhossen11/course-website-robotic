import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { db } = await connectToDatabase();
    
    const { uid, email, name, image, provider = 'google' } = await request.json();
    
    if (!uid || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ uid });
    
    let user;
    
    if (existingUser) {
      // Update existing user
      await usersCollection.updateOne(
        { uid },
        { 
          $set: {
            name,
            image: image || existingUser.image,
            lastLogin: new Date(),
            emailVerified: true,
          }
        }
      );
      user = await usersCollection.findOne({ uid });
    } else {
      // Create new user
      const newUser = {
        uid,
        email,
        name,
        image: image || '',
        role: 'student', // Default role
        enrolledCourses: [],
        createdAt: new Date(),
        lastLogin: new Date(),
        provider,
        emailVerified: true,
      };
      
      const result = await usersCollection.insertOne(newUser);
      user = await usersCollection.findOne({ _id: result.insertedId });
    }
    
    // Transform ObjectId to string
    const userResponse = {
      _id: user._id.toString(),
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      enrolledCourses: user.enrolledCourses || [],
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      provider: user.provider,
    };
    
    return NextResponse.json({
      message: 'User synced successfully',
      user: userResponse
    }, { status: 200 });
    
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}