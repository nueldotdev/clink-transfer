require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const { generateVerificationToken, matchKeys } = require('./services/functions.js');
const { sendVerificationEmail } = require('./services/mailing.js');

const User = require('./schema/userSchema.js');
const usersRouter = require('./routes/users.js');

// Get environment variables from .env
const uri = process.env.DB_URL; // DB Url
const secretKey = process.env.JWT_SECRET; // JWT Secret

// Create set for expired tokens
const tokenBlacklist = new Set();

// Initialize Express app
const app = express();

// Set CORS headers
app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json());

app.use((req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    const checkToken = jwt.verify(token, secretKey);

    if (checkToken) {
      next();
    } else {
      return res.sendStatus(401);
    }
  }

  next();
});

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
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const newUser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword
    })

    // run password matching test
    const { matched } = await matchKeys(data.password, hashedPassword);
    console.log("Matched: ", matched);
    
    if (!matched) {
      return res.status(401).json({ message: 'Error creating user' });
    }

    const saveUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ user_id: saveUser._id, email: saveUser.email }, secretKey, { expiresIn: '1d' });

    res.json({ message: 'User created successfully', user: saveUser, token })
    
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
  console.log("===== User login requested =====");

  try {
    console.log("Getting user")
    // Find the user by email
    const user = await User.findOne({ email: data.email });

    if (!user) {
      console.log({err: "User not found!"})
      return res.status(404).json({message: "Invalid email or password!"})
    }

    console.log("Checking password")
    // Check password
    const { matched } = await matchKeys(data.password, user.password);
    if (!matched) {
      console.log({err: "Password not matching!"});
      return res.status(401).json({ message: "Invalid email or password!" })
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user._id, email: user.email }, secretKey, { expiresIn: '1d' });

 
    // Return User Obj with token
    res.json({ message: 'User logged in successfully', user, token });
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

    const { verifyToken, tokenExpires } = generateVerificationToken();
    user.verificationToken = verifyToken;
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
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    user.isVerified = true;
    user.verificationToken = "";
    user.tokenExpires = null;
    await user.save();

    console.log("User verified: ", user);
    res.status(200).json({ message: 'User Verified Successfully!', user });
    
  } catch (error) {
    console.log("Error details: ");

    res.status(500).json({ message: 'Failed to Verify User', error: error.message });
  }
});




// User logout endpoint (not fully implemented)
app.post('/user-logout', async (req, res) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }


  if (token) {
    try {
      const decoded = jwt.decode(token);
      decoded.exp = Math.floor(Date.now() / 1000) - 1;
      return res.json({message: 'User logged out successfully'})
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

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