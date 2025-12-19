import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    // Await params since it's a Promise
    const { uid } = await params;
    
    console.log('Fetching enrollments for user ID:', uid);
    
    if (!uid) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User ID is required',
          error: 'USER_ID_REQUIRED'
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    console.log('✅ Database connected for user:', uid);
    
    // Check if user exists
    const user = await db.collection('users').findOne({ 
      uid: uid 
    });
    
    if (!user) {
      console.log('⚠️ User not found in database:', uid);
      return NextResponse.json({
        success: false,
        message: 'User not found',
        enrollments: [],
        count: 0
      }, { status: 404 });
    }
    
    // Get user enrollments
    const enrollments = await db.collection('enrollments')
      .find({ 
        $or: [
          { userId: uid },
          { userEmail: user.email }
        ]
      })
      .sort({ enrolledAt: -1 })
      .toArray();

    console.log(`📊 Found ${enrollments.length} enrollments for user: ${uid}`);

    // Transform response - safely handle ObjectId
    const transformedEnrollments = enrollments.map(enrollment => ({
      enrollmentId: enrollment._id ? enrollment._id.toString() : `enrollment_${Date.now()}`,
      userId: enrollment.userId || uid,
      userName: enrollment.userName || user.name || 'User',
      userEmail: enrollment.userEmail || user.email,
      courseId: enrollment.courseId || 'ai-web-dev',
      courseName: enrollment.courseName || 'AI Powered Web Development',
      coursePrice: enrollment.coursePrice || 297,
      finalAmount: enrollment.finalAmount || enrollment.coursePrice || 297,
      transactionId: enrollment.transactionId || 'Not provided',
      paymentMethod: enrollment.paymentMethod || 'bkash',
      status: enrollment.status || 'pending',
      adminNotes: enrollment.adminNotes || null,
      reviewedBy: enrollment.reviewedBy || null,
      reviewedAt: enrollment.reviewedAt || null,
      enrolledAt: enrollment.enrolledAt || enrollment.createdAt || new Date(),
      createdAt: enrollment.createdAt || new Date(),
      // Additional fields
      phoneNumber: enrollment.phoneNumber || user.phoneNumber || 'Not provided',
      couponCode: enrollment.couponCode || null,
      discountAmount: enrollment.discountAmount || 0
    }));

    return NextResponse.json({
      success: true,
      user: {
        id: user._id?.toString() || uid,
        name: user.name || 'User',
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt || null,
        phoneNumber: user.phoneNumber || null
      },
      enrollments: transformedEnrollments,
      count: transformedEnrollments.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching user enrollments:', error);
    
    // Handle specific errors
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: 'DATABASE_CONNECTION_FAILED'
      }, { status: 503 });
    }
    
    if (error.code === 'ETIMEOUT') {
      return NextResponse.json({
        success: false,
        message: 'Request timeout',
        error: 'REQUEST_TIMEOUT'
      }, { status: 408 });
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch enrollments',
        error: error.message || 'UNKNOWN_ERROR',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: Support POST for creating enrollments via API
export async function POST(request, { params }) {
  try {
    const { uid } = await params;
    const data = await request.json();
    
    console.log('Creating enrollment for user:', uid, 'Data:', data);
    
    if (!uid) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Create enrollment
    const enrollmentId = `ENR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    const enrollment = {
      _id: enrollmentId,
      userId: uid,
      ...data,
      status: 'pending',
      enrolledAt: new Date(),
      lastUpdated: new Date()
    };
    
    const result = await db.collection('enrollments').insertOne(enrollment);
    
    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        enrollmentId: enrollmentId,
        message: 'Enrollment created successfully'
      }, { status: 201 });
    } else {
      throw new Error('Failed to create enrollment');
    }
    
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create enrollment'
    }, { status: 500 });
  }
}