import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request) {
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
    
    const { courseId } = await request.json();
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Find user by Firebase UID
    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please complete registration.' },
        { status: 404 }
      );
    }
    
    // Check if already enrolled
    const isEnrolled = user.isEnrolledInCourse(courseId);
    if (isEnrolled) {
      return NextResponse.json(
        { message: 'Already enrolled in this course', enrolled: true },
        { status: 200 }
      );
    }
    
    // Enroll user
    user.enrolledCourses.push({
      courseId: courseId,
      enrolledAt: new Date(),
      progress: 0,
      completed: false,
    });
    
    await user.save();
    
    // Update course student count
    course.totalStudents += 1;
    await course.save();
    
    return NextResponse.json({
      message: 'Successfully enrolled in course',
      courseId,
      redirectUrl: `/courses/${courseId}/learn`,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Verify Firebase token from header or query
    const authHeader = request.headers.get('authorization');
    let uid;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(token);
      uid = decodedToken.uid;
    } else {
      // For client-side, you might pass UID as query param
      const { searchParams } = new URL(request.url);
      uid = searchParams.get('uid');
      
      if (!uid) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
    await connectDB();
    
    const user = await User.findOne({ uid }).populate({
      path: 'enrolledCourses.courseId',
      select: 'title description thumbnail duration instructor price',
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
    
    return NextResponse.json({
      enrolledCourses: user.enrolledCourses,
      totalEnrolled: user.enrolledCourses.length,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Get enrollments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}