const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmail({ to, subject, template, data }) {
  try {
    const html = generateEmailTemplate(template, data);
    
    const mailOptions = {
      from: `"Learning BD" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

function generateEmailTemplate(template, data) {
  switch (template) {
    case 'enrollment-submitted':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Enrollment Submitted Successfully!</h2>
          <p>Hello ${data.userName},</p>
          <p>Your enrollment for <strong>${data.courseName}</strong> has been submitted successfully.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Enrollment Details:</h3>
            <p><strong>Enrollment ID:</strong> ${data.enrollmentId}</p>
            <p><strong>Amount Paid:</strong> $${data.amount}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          </div>
          <p>Your enrollment is now pending admin verification. You will receive another email once it's approved.</p>
          <p>Expected verification time: 24 hours</p>
          <p>Best regards,<br>Learning BD Team</p>
        </div>
      `;

    case 'enrollment-approved':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">🎉 Enrollment Approved!</h2>
          <p>Hello ${data.userName},</p>
          <p>Great news! Your enrollment for <strong>${data.courseName}</strong> has been approved!</p>
          <p>You now have full access to the course content.</p>
          <div style="background: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Start Learning Now:</h3>
            <p><a href="${data.courseLink}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Access Course</a></p>
          </div>
          <p>Happy learning! 🚀</p>
          <p>Best regards,<br>Learning BD Team</p>
        </div>
      `;

    // Add more templates as needed
    default:
      return `<p>${JSON.stringify(data)}</p>`;
  }
}