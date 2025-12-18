import { connectToDatabase } from '@/lib/mongodb';
import { sendEnrollmentConfirmation, testEmailConfig } from '@/lib/email-service';

export async function POST(request) {
  try {
    const enrollmentData = await request.json();
    console.log('📥 Received enrollment data:', enrollmentData);
    
    // Connect to database
    const { db } = await connectToDatabase();
    console.log('✅ Database connected successfully');
    
    // Validate required fields
    const requiredFields = ['userEmail', 'courseId', 'transactionId', 'phoneNumber'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!enrollmentData[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return Response.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enrollmentData.userEmail)) {
      return Response.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }
    
    // Validate phone number format
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(enrollmentData.phoneNumber)) {
      return Response.json({
        success: false,
        message: 'Please enter a valid Bangladeshi mobile number'
      }, { status: 400 });
    }
    
    // Check if transaction ID already exists
    const existingEnrollment = await db.collection('enrollments').findOne({ 
      transactionId: enrollmentData.transactionId 
    });
    
    if (existingEnrollment) {
      console.error('❌ Duplicate transaction ID:', enrollmentData.transactionId);
      return Response.json({
        success: false,
        message: 'Transaction ID already used. Please use a different transaction ID.'
      }, { status: 400 });
    }
    
    // Generate unique enrollment ID
    const enrollmentId = `ENR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    console.log('🆔 Generated enrollment ID:', enrollmentId);
    
    // Get or generate user ID
    const userId = enrollmentData.userId || 
                   `user_${enrollmentData.userEmail.split('@')[0]}_${Date.now().toString(36)}`;
    
    // Create enrollment document
    const enrollment = {
      _id: enrollmentId,
      userId: userId,
      userEmail: enrollmentData.userEmail.toLowerCase().trim(),
      userName: enrollmentData.userName || enrollmentData.userEmail.split('@')[0],
      courseId: enrollmentData.courseId,
      courseName: enrollmentData.courseName || 'AI Powered Web Development & Software Architecture',
      coursePrice: enrollmentData.coursePrice || 297,
      finalAmount: enrollmentData.finalAmount || enrollmentData.coursePrice || 297,
      paymentMethod: enrollmentData.paymentMethod || 'bkash',
      transactionId: enrollmentData.transactionId.trim(),
      phoneNumber: enrollmentData.phoneNumber.trim(),
      couponCode: enrollmentData.couponCode || null,
      discountAmount: enrollmentData.discountAmount || 0,
      status: 'pending',
      enrolledAt: new Date(),
      lastUpdated: new Date(),
      emailSent: false,
      emailSentAt: null
    };
    
    console.log('📝 Saving enrollment to database...');
    
    // Save enrollment to database
    const result = await db.collection('enrollments').insertOne(enrollment);
    
    if (result.acknowledged) {
      console.log('✅ Enrollment saved successfully:', enrollmentId);
      
      // Update user record
      try {
        await db.collection('users').updateOne(
          { email: enrollment.userEmail },
          {
            $setOnInsert: {
              _id: userId,
              name: enrollment.userName,
              email: enrollment.userEmail,
              role: 'user',
              createdAt: new Date()
            },
            $push: {
              enrolledCourses: {
                courseId: enrollment.courseId,
                enrollmentId: enrollmentId,
                status: 'pending',
                enrolledAt: enrollment.enrolledAt,
                courseName: enrollment.courseName,
                coursePrice: enrollment.coursePrice
              }
            },
            $set: {
              updatedAt: new Date(),
              lastEnrollment: enrollment.enrolledAt,
              phoneNumber: enrollment.phoneNumber
            }
          },
          { upsert: true }
        );
        console.log('✅ User record updated');
      } catch (userError) {
        console.warn('⚠️ Could not update user record:', userError.message);
      }
      
      // ================================
      // SEND EMAIL NOTIFICATION
      // ================================
      console.log('📧 Attempting to send confirmation email...');
      
      let emailResult = { success: false, message: 'Email not sent' };
      
      // Check if email is enabled
      if (process.env.EMAIL_ENABLED === 'true' && process.env.EMAIL_USER) {
        // Test email config first
        const emailConfigOk = await sendEnrollmentConfirmation();
        
        if (emailConfigOk) {
          try {
            // Prepare email data
            const emailData = {
              enrollmentId: enrollmentId,
              transactionId: enrollment.transactionId,
              courseName: enrollment.courseName,
              userName: enrollment.userName,
              finalAmount: enrollment.finalAmount,
              paymentMethod: enrollment.paymentMethod,
              status: enrollment.status
            };
            
            // Send confirmation email
            emailResult = await sendEnrollmentConfirmation(enrollment.userEmail, emailData);
            
            if (emailResult.success) {
              // Update enrollment with email sent status
              await db.collection('enrollments').updateOne(
                { _id: enrollmentId },
                {
                  $set: {
                    emailSent: true,
                    emailSentAt: new Date(),
                    emailMessageId: emailResult.messageId
                  }
                }
              );
              console.log('✅ Confirmation email sent successfully');
            } else {
              console.warn('⚠️ Email sending failed:', emailResult.error);
            }
          } catch (emailError) {
            console.error('❌ Email sending error:', emailError);
            // Don't fail the enrollment if email fails
          }
        } else {
          console.warn('⚠️ Email configuration failed, skipping email');
        }
      } else {
        console.log('ℹ️ Email disabled or not configured');
      }
      
      // Send success response
      return Response.json({
        success: true,
        enrollmentId: enrollmentId,
        emailSent: emailResult.success,
        message: 'Enrollment submitted successfully! ' + 
                 (emailResult.success ? 
                  'Confirmation email sent. Please check your inbox.' : 
                  'Please check your email for confirmation.'),
        details: {
          enrollmentId: enrollmentId,
          status: 'pending',
          course: enrollment.courseName,
          amount: enrollment.finalAmount,
          expectedApprovalTime: '24 hours',
          emailStatus: emailResult.success ? 'Sent' : 'Not sent'
        }
      });
    } else {
      throw new Error('Failed to save enrollment');
    }
    
  } catch (error) {
    console.error('❌ Error submitting enrollment:', error);
    
    if (error.code === 11000) {
      return Response.json({
        success: false,
        message: 'Transaction ID already used. Please use a different transaction ID.'
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      message: error.message || 'Failed to submit enrollment.'
    }, { status: 500 });
  }
}

// import { connectToDatabase } from '@/lib/mongodb';

// export async function POST(request) {
//   try {
//     const enrollmentData = await request.json();
//     console.log('📥 Received enrollment data:', enrollmentData);
    
//     // Connect to database
//     const { db } = await connectToDatabase();
//     console.log('✅ Database connected successfully');
    
//     // Validate required fields (removed userId requirement)
//     const requiredFields = ['userEmail', 'courseId', 'transactionId', 'phoneNumber'];
//     const missingFields = [];
    
//     for (const field of requiredFields) {
//       if (!enrollmentData[field]) {
//         missingFields.push(field);
//       }
//     }
    
//     if (missingFields.length > 0) {
//       console.error('❌ Missing required fields:', missingFields);
//       return Response.json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(', ')}`
//       }, { status: 400 });
//     }
    
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(enrollmentData.userEmail)) {
//       return Response.json({
//         success: false,
//         message: 'Invalid email format'
//       }, { status: 400 });
//     }
    
//     // Validate phone number format (Bangladeshi)
//     const phoneRegex = /^01[3-9]\d{8}$/;
//     if (!phoneRegex.test(enrollmentData.phoneNumber)) {
//       return Response.json({
//         success: false,
//         message: 'Please enter a valid Bangladeshi mobile number (e.g., 013XXXXXXXX or 017XXXXXXXX)'
//       }, { status: 400 });
//     }
    
//     // Check if transaction ID already exists
//     const existingEnrollment = await db.collection('enrollments').findOne({ 
//       transactionId: enrollmentData.transactionId 
//     });
    
//     if (existingEnrollment) {
//       console.error('❌ Duplicate transaction ID:', enrollmentData.transactionId);
//       return Response.json({
//         success: false,
//         message: 'Transaction ID already used. Please use a different transaction ID.'
//       }, { status: 400 });
//     }
    
//     // Generate unique enrollment ID
//     const enrollmentId = `ENR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
//     console.log('🆔 Generated enrollment ID:', enrollmentId);
    
//     // Get or generate user ID from email
//     // If userId is provided, use it. Otherwise, create a simple ID from email
//     const userId = enrollmentData.userId || 
//                    `user_${enrollmentData.userEmail.split('@')[0]}_${Date.now().toString(36)}`;
    
//     // Create enrollment document
//     const enrollment = {
//       _id: enrollmentId,
//       userId: userId, // Use generated or provided userId
//       userEmail: enrollmentData.userEmail.toLowerCase().trim(),
//       userName: enrollmentData.userName || enrollmentData.userEmail.split('@')[0],
//       courseId: enrollmentData.courseId,
//       courseName: enrollmentData.courseName || 'AI Powered Web Development & Software Architecture',
//       coursePrice: enrollmentData.coursePrice || 297,
//       finalAmount: enrollmentData.finalAmount || enrollmentData.coursePrice || 297,
//       paymentMethod: enrollmentData.paymentMethod || 'bkash',
//       transactionId: enrollmentData.transactionId.trim(),
//       phoneNumber: enrollmentData.phoneNumber.trim(),
//       couponCode: enrollmentData.couponCode || null,
//       discountAmount: enrollmentData.discountAmount || 0,
//       status: 'pending',
//       enrolledAt: new Date(),
//       lastUpdated: new Date(),
//       // Additional fields for tracking
//       ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
//       userAgent: request.headers.get('user-agent') || 'unknown'
//     };
    
//     console.log('📝 Saving enrollment to database...');
    
//     // Save enrollment to database
//     const result = await db.collection('enrollments').insertOne(enrollment);
    
//     if (result.acknowledged) {
//       console.log('✅ Enrollment saved successfully:', enrollmentId);
      
//       // Also update or create user in users collection
//       try {
//         await db.collection('users').updateOne(
//           { email: enrollment.userEmail },
//           {
//             $setOnInsert: {
//               _id: userId,
//               name: enrollment.userName,
//               email: enrollment.userEmail,
//               role: 'user',
//               createdAt: new Date()
//             },
//             $push: {
//               enrolledCourses: {
//                 courseId: enrollment.courseId,
//                 enrollmentId: enrollmentId,
//                 status: 'pending',
//                 enrolledAt: enrollment.enrolledAt,
//                 courseName: enrollment.courseName,
//                 coursePrice: enrollment.coursePrice
//               }
//             },
//             $set: {
//               updatedAt: new Date(),
//               lastEnrollment: enrollment.enrolledAt,
//               phoneNumber: enrollment.phoneNumber
//             }
//           },
//           { upsert: true }
//         );
//         console.log('✅ User record updated/created successfully');
//       } catch (userError) {
//         console.warn('⚠️ Could not update user record:', userError.message);
//         // Continue even if user update fails
//       }
      
//       // Send success response
//       return Response.json({
//         success: true,
//         enrollmentId: enrollmentId,
//         message: 'Enrollment submitted successfully!',
//         details: {
//           enrollmentId: enrollmentId,
//           status: 'pending',
//           course: enrollment.courseName,
//           amount: enrollment.finalAmount,
//           expectedApprovalTime: '24 hours'
//         }
//       });
//     } else {
//       throw new Error('Failed to save enrollment - database did not acknowledge the insert');
//     }
    
//   } catch (error) {
//     console.error('❌ Error submitting enrollment:', error);
    
//     // Handle duplicate key error
//     if (error.code === 11000 || error.message.includes('duplicate')) {
//       return Response.json({
//         success: false,
//         message: 'Transaction ID already used. Please use a different transaction ID.'
//       }, { status: 400 });
//     }
    
//     // Handle specific MongoDB errors
//     if (error.name === 'MongoNetworkError') {
//       return Response.json({
//         success: false,
//         message: 'Network error. Please check your internet connection and try again.'
//       }, { status: 500 });
//     }
    
//     if (error.name === 'MongoServerSelectionError') {
//       return Response.json({
//         success: false,
//         message: 'Database server is not available. Please try again later.'
//       }, { status: 500 });
//     }
    
//     if (error.name === 'MongoTimeoutError') {
//       return Response.json({
//         success: false,
//         message: 'Request timed out. Please try again.'
//       }, { status: 500 });
//     }
    
//     return Response.json({
//       success: false,
//       message: 'Failed to submit enrollment. Please try again.',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     }, { status: 500 });
//   }
// }