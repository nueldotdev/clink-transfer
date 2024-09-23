require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const cors = require('cors');


const { generateVerificationToken } = require('./services/functions.js');
const { sendVerificationEmail } = require('./services/mailing.js');

const User = require('./schema/userSchema.js');
const usersRouter = require('./routes/users.js');

// Get database URL from .env file
const uri = process.env.DB_URL;

// Initialize Express app
const app = express();

// Set CORS headers
app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json());


// Server testing endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Server is up and running!',
  })
});

app.get('/test', async (req, res) => {
  res.json({
    message: 'Test endpoint is working',
  })
})

// Test auth endpoint
app.get('/test-auth', async (req, res) => {
  console.log("Test auth endpoint called")

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    console.log("Verifying token")
    res.json({ message: 'Token is valid' });
    console.log("Token is valid")
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});



// Create user document
app.post('/signup-and-login', async (req, res) => {
  const data = req.body;
  console.log(data);

  try {
    // Create user
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { token, tokenExpires } = generateVerificationToken();


    const newUser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      verificationToken: token,
      tokenExpires: tokenExpires
    })

    const saveUser = await newUser.save();
    console.log("User created:", saveUser);
    res.json({message: 'User created successfully', user: saveUser})

    // Log in user
    // const authData = await pb.collection('users').authWithPassword(data.email, data.password);
    // console.log("User logged in:", authData);

    // // Send combined response
    // res.json({
    //   message: 'User created and logged in successfully',
    //   user: authData.record,
    //   token: authData.token
    // });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: 'Failed to create or login user',
      error: error.response?.data || error.message
    });
  }
});


// User login
app.post('/user-login', async (req, res) => {
  const data = req.body;
  console.log(data)

  try {
    const user = await pb.collection('users').authWithPassword(data.email, data.password);
    console.log("User: ", user)
    res.json({ message: 'User logged in successfully', user });
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: 'Failed to login user', error: error.response });
  }
})


// Email verification endpoint
app.post('/verify-email', async (req, res) => {
  const { email } = req.body;
  console.log("Email received:", email);

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const { token, tokenExpires } = generateVerificationToken();
    user.verificationToken = token;
    user.tokenExpires = tokenExpires;
    await user.save();

    await sendVerificationEmail(user);

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in /verify-email:', error);
    res.status(500).json({ message: 'Failed to send verification email', error: error.message });
  }
})


// Email token verification endpoint
app.post('/verify-email-token', async (req, res) => {
  const data = req.body;
  console.log("Data received: ", data);

  try {
    const user = await User.findOne({ verificationToken: data.token });
    
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }
    
    user.isVerified = true;
    user.verificationToken = "";
    user.tokenExpires = null;
    await user.save();

    console.log("User verified: ", user);
    res.json({ message: 'User Verified Successfully!', user });
    
  } catch (error) {
    console.log("Error details: ", error);  // Log the full error object

    res.status(error.status || 500).json({
      message: 'Failed to verify user',
      error: error.response || 'Unknown error',
    });
  }
});




// User logout endpoint (not fully implemented)
app.post('/user-logout', async (req, res) => {
  pb.authStore.clear();
  res.json({message: 'User logged out successfully'})
})



// Admin login (unused)
app.post('/admin/login', async (req, res) => {
  try {
    const authAdmin = await pb.admins.authWithPassword(req.body.email, req.body.password);
    console.log(" Admin logged in: ", authAdmin)
    res.json({message: 'Admin logged in successfully', authAdmin})
  } catch (error) {
    console.error('Failed to login as admin:', error.response);
    res.status(400).json({ message: 'Failed to log in admin', error: error.response });
  }
})


app.use('/users', usersRouter);


// Running server
async function startServer() {
  try {
      const connection = await mongoose.connect(uri)
      console.log('MongoDB connected')
      // Start the server
      port = process.env.PORT || 5500
      app.listen(port, () => {
          console.log(`Server running on http://localhost:${port}`);
      })
  } catch (error) {
      console.error("Error connecting to database:", error);
  }
}

startServer()