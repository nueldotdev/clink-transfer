require('dotenv').config();
const nodemailer = require('nodemailer');

const prod = process.env.prod;
const dev = process.env.dev;

const status = dev;

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or use any other email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
async function sendVerificationEmail(user) {
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Clink - Email Verification',
    html: `<h1>Hi, ${user.firstName}</h1>
    <h3>Welcome to Clink!</h3>
    <p>Thanks for joining us!</p>
    <p>Please verify your email by typing the 6-digit code below into the website.</p>
    <br>
    <h2>${user.entryCode}</h2>
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



async function sendEntryEmail(user) {
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Clink - Login Requested!',
    html: `<h1>Hi, ${user.firstName}</h1>
    <h3>You just attempted a login!</h3>
    <p>If this was you, please input the 6-digit code below into the website.</p>
    <p>If this was not you, please ignore this email.</p>
    <br>
    <h2>${user.entryCode}</h2>
    <br>
    <p>Best regards,<br>The Clink Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Entry Code sent successfully');
  } catch (error) {
    console.error('Error sending entry code:', error);
    throw new Error('Failed to send entry code: ' + error.message);
  }
}

module.exports = { sendVerificationEmail, sendEntryEmail };