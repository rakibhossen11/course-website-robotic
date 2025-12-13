import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminAuth } from '@/lib/firebase-admin';

// Create or update user
export async function POST(request) {
  try {
    await connectDB();
    
    const { uid, email, name, image, provider = 'google' } = await request.json();
    
    if (!uid || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    let user = await User.findOne({ uid });
    
    if (user) {
      // Update existing user
      user.name = name;
      user.image = image || user.image;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        uid,
        email,
        name,
        image,
        role: 'student',
        enrolledCourses: [],
        createdAt: new Date(),
        lastLogin: new Date(),
        provider,
        emailVerified: true, // Google accounts are verified
      });
    }
    
    return NextResponse.json({
      message: 'User created/updated successfully',
      user: {
        id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        enrolledCourses: user.enrolledCourses,
      },
    }, { status: 200 });
    
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

// Get all users (admin only)
export async function GET(request) {
  try {
    // Verify Firebase token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    await connectDB();
    
    // Check if user is admin
    const user = await User.findOne({ uid: decodedToken.uid });
    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    const users = await User.find().select('-__v');
    
    return NextResponse.json({ users }, { status: 200 });
    
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}