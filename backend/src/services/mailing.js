const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or use any other email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
async function sendVerificationEmail(user) {
  const url = `https://clink0.vercel.app/verify-email?token=${user.verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Clink - Email Verification',
    html: `<h3>Welcome to Clink!</h3>
    <p style="margin-bottom: 10px;">Thanks for joining us!</p>
    <p style="margin-bottom: 10px;">Please verify your email by clicking the link below:</p>
    <br>
    <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <br>
    <br>
    <p>Best regards,<br>The Clink Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email: ' + error.message);
  }
}

// Usage
// await sendVerificationEmail(newUser);

module.exports = { sendVerificationEmail };