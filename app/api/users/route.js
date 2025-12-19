import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
// import { adminAuth } from '@/lib/firebase-admin';

// Create or update user
export async function POST(request) {
  try {
    await connectToDatabase();
    
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

// Get all users with session-based admin check
export async function GET(request) {
  try {
    // Check for session cookie or token
    // const sessionToken = request.cookies.get('session-token')?.value;
    
    // if (!sessionToken) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Verify session from sessions collection
    // const sessionsCollection = db.collection('sessions');
    // const session = await sessionsCollection.findOne({ 
    //   token: sessionToken,
    //   expires: { $gt: new Date() } // Not expired
    // });
    
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Session expired' },
    //     { status: 401 }
    //   );
    // }
    
    // Get user from users collection
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ uid: session.userId });
    
    // Check if user is admin
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Forbidden: Admin access required' },
    //     { status: 403 }
    //   );
    // }
    
    // Fetch all users (excluding sensitive data)
    const allUsers = await usersCollection.find({}, {
      projection: {
        password: 0, // Exclude password if exists
        __v: 0, // Exclude version key
        // Add other fields to exclude
      }
    }).toArray();
    
    // Transform ObjectId to string
    const users = allUsers.map(u => ({
      ...u,
      _id: u._id.toString(),
    }));
    
    return NextResponse.json({ users }, { status: 200 });
    
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Get all users (admin only)
// export async function GET(request) {
//   try {
//     // Verify Firebase token
//     // const authHeader = request.headers.get('authorization');
//     // if (!authHeader?.startsWith('Bearer ')) {
//     //   return NextResponse.json(
//     //     { error: 'Unauthorized' },
//     //     { status: 401 }
//     //   );
//     // }
    
//     const token = authHeader.split('Bearer ')[1];
//     const decodedToken = await adminAuth.verifyIdToken(token);
    
//     await connectToDatabase();
    
//     // Check if user is admin
//     // const user = await User.findOne({ uid: decodedToken.uid });
//     // if (user?.role !== 'admin') {
//     //   return NextResponse.json(
//     //     { error: 'Forbidden: Admin access required' },
//     //     { status: 403 }
//     //   );
//     // }
    
//     const users = await User.find().select('-__v');
    
//     return NextResponse.json({ users }, { status: 200 });
    
//   } catch (error) {
//     console.error('Get users error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch users' },
//       { status: 500 }
//     );
//   }
// }