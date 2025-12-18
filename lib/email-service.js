import nodemailer from 'nodemailer';

// Create a transporter using your email service
// For Gmail: You need to generate an "App Password" if using 2FA
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email configuration
export async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
}

// Send enrollment confirmation email
export async function sendEnrollmentConfirmation(email, enrollmentData) {
  try {
    const mailOptions = {
      from: `"Robo Club" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Enrollment Submitted - ${enrollmentData.courseName}`,
      html: generateEnrollmentEmail(enrollmentData),
      text: generateTextEnrollmentEmail(enrollmentData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Enrollment confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send enrollment email:', error);
    return { success: false, error: error.message };
  }
}

// Send enrollment approval email
export async function sendEnrollmentApproval(email, enrollmentData) {
  try {
    const mailOptions = {
      from: `"Robo Club" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Enrollment Approved - ${enrollmentData.courseName}`,
      html: generateApprovalEmail(enrollmentData),
      text: generateTextApprovalEmail(enrollmentData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Enrollment approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send approval email:', error);
    return { success: false, error: error.message };
  }
}

// Send enrollment rejection email
export async function sendEnrollmentRejection(email, enrollmentData) {
  try {
    const mailOptions = {
      from: `"Robo Club" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: `❌ Enrollment Update - ${enrollmentData.courseName}`,
      html: generateRejectionEmail(enrollmentData),
      text: generateTextRejectionEmail(enrollmentData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Enrollment rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send rejection email:', error);
    return { success: false, error: error.message };
  }
}

// Email templates
function generateEnrollmentEmail(enrollment) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enrollment Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .course-name {
          color: #059669;
          font-size: 22px;
          margin: 15px 0;
        }
        .details-box {
          background-color: #f0f9ff;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-label {
          font-weight: 600;
          color: #4b5563;
        }
        .detail-value {
          color: #111827;
          font-weight: 500;
        }
        .status-pending {
          display: inline-block;
          background-color: #fef3c7;
          color: #92400e;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        .next-steps {
          background-color: #d1fae5;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🤖 Robo Club</div>
          <h1>Thank You for Your Enrollment!</h1>
        </div>
        
        <p>Hello <strong>${enrollment.userName}</strong>,</p>
        
        <p>We've received your enrollment request for:</p>
        
        <div class="course-name">${enrollment.courseName}</div>
        
        <div class="details-box">
          <h3 style="margin-top: 0; color: #2563eb;">📋 Enrollment Details</h3>
          
          <div class="detail-row">
            <span class="detail-label">Enrollment ID:</span>
            <span class="detail-value">${enrollment.enrollmentId}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Transaction ID:</span>
            <span class="detail-value">${enrollment.transactionId}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Amount Paid:</span>
            <span class="detail-value">$${enrollment.finalAmount}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${enrollment.paymentMethod}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="status-pending">⏳ Pending Verification</span>
          </div>
        </div>
        
        <div class="next-steps">
          <h3 style="color: #059669; margin-top: 0;">📅 What Happens Next?</h3>
          <ol style="padding-left: 20px;">
            <li>Our team will verify your payment (usually within 24 hours)</li>
            <li>You'll receive another email once your enrollment is approved</li>
            <li>After approval, you'll get immediate access to all course materials</li>
            <li>You can track your enrollment status anytime</li>
          </ol>
        </div>
        
        <p><strong>Important:</strong> Keep this enrollment ID and transaction ID safe for future reference.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
            View Your Dashboard
          </a>
        </div>
        
        <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
        
        <div class="footer">
          <p>Best regards,<br>The Robo Club Team</p>
          <p>📧 ${process.env.EMAIL_FROM || 'support@roboclub.com'}<br>📞 +880 1700-000000</p>
          <p style="font-size: 12px; color: #9ca3af;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTextEnrollmentEmail(enrollment) {
  return `
Thank You for Your Enrollment - Robo Club
==========================================

Hello ${enrollment.userName},

We've received your enrollment request for:
${enrollment.courseName}

📋 Enrollment Details:
- Enrollment ID: ${enrollment.enrollmentId}
- Transaction ID: ${enrollment.transactionId}
- Amount Paid: $${enrollment.finalAmount}
- Payment Method: ${enrollment.paymentMethod}
- Status: ⏳ Pending Verification

📅 What Happens Next?
1. Our team will verify your payment (usually within 24 hours)
2. You'll receive another email once your enrollment is approved
3. After approval, you'll get immediate access to all course materials
4. You can track your enrollment status anytime

Important: Keep this enrollment ID and transaction ID safe for future reference.

View Your Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard

If you have any questions, feel free to contact our support team.

Best regards,
The Robo Club Team
${process.env.EMAIL_FROM || 'support@roboclub.com'}
+880 1700-000000
  `;
}

function generateApprovalEmail(enrollment) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enrollment Approved</title>
      <style>
        /* Same styles as above with green theme */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .container { background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
        .course-name { color: #059669; font-size: 22px; margin: 15px 0; }
        .status-approved { display: inline-block; background-color: #d1fae5; color: #065f46; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .button { display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎉 Robo Club</div>
          <h1>Your Enrollment Has Been Approved!</h1>
        </div>
        
        <p>Hello <strong>${enrollment.userName}</strong>,</p>
        
        <p>Great news! Your enrollment for <strong>${enrollment.courseName}</strong> has been approved!</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <span class="status-approved">✅ Approved & Active</span>
        </div>
        
        <p>You now have full access to all course materials. Start your learning journey today!</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/courses/${enrollment.courseId}" class="button">
            Start Learning Now
          </a>
        </div>
        
        <div class="footer">
          <p>Happy learning! 🚀<br>The Robo Club Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTextApprovalEmail(enrollment) {
  return `Your enrollment for ${enrollment.courseName} has been approved! Start learning now.`;
}

function generateRejectionEmail(enrollment) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enrollment Update</title>
      <style>
        /* Same styles as above with red theme */
        .logo { color: #dc2626; }
        .status-rejected { display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">❌ Robo Club</div>
          <h1>Enrollment Update</h1>
        </div>
        
        <p>Hello <strong>${enrollment.userName}</strong>,</p>
        
        <p>We couldn't verify your payment for <strong>${enrollment.courseName}</strong>.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <span class="status-rejected">❌ Payment Verification Failed</span>
        </div>
        
        <p><strong>Reason:</strong> ${enrollment.reason || 'Payment verification failed'}</p>
        
        <p>Please check your payment details and try again. If you believe this is a mistake, please contact our support team.</p>
        
        <div class="footer">
          <p>Best regards,<br>The Robo Club Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTextRejectionEmail(enrollment) {
  return `Your enrollment for ${enrollment.courseName} was rejected. Reason: ${enrollment.reason || 'Payment verification failed'}`;
}