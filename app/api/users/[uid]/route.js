import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    const { uid } = params;
    
    await connectDB();
    
    const user = await User.findOne({ uid }).populate({
      path: 'enrolledCourses.courseId',
      select: 'title description thumbnail duration instructor',
      populate: {
        path: 'instructor',
        select: 'name email image',
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data without sensitive info
    const userData = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      enrolledCourses: user.enrolledCourses,
      createdAt: user.createdAt,
      subscription: user.subscription,
    };
    
    return NextResponse.json(userData, { status: 200 });
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(request, { params }) {
  try {
    const { uid } = params;
    const updates = await request.json();
    
    await connectDB();
    
    const user = await User.findOne({ uid });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Allowed fields to update
    const allowedUpdates = ['name', 'image', 'subscription'];
    const updatesToApply = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updatesToApply[key] = updates[key];
      }
    });
    
    Object.assign(user, updatesToApply);
    await user.save();
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        subscription: user.subscription,
      },
    }, { status: 200 });
    
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}