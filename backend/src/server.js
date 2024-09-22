import PocketBase from 'pocketbase';
import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users.js';

// Initialize PocketBase as Databse
export const pb = new PocketBase('http://127.0.0.1:8090');
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
    db: `${pb}`
  })
});

app.get('/test', async (req, res) => {
  res.json({
    message: 'Test endpoint is working',
    authStore: pb.authStore
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
    await pb.collection('users').authRefresh();
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
    const user = await pb.collection('users').create(data);
    console.log("User created:", user);

    // Log in user
    const authData = await pb.collection('users').authWithPassword(data.email, data.password);
    console.log("User logged in:", authData);

    // Send combined response
    res.json({
      message: 'User created and logged in successfully',
      user: authData.record,
      token: authData.token
    });
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
  const data = req.body;
  console.log(data)

  try {
    const user = await pb.collection('users').requestVerification(data.email);
    console.log("User: ", user)
    res.json({ message: 'Verification email sent successfully', user });
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: 'Failed to send verification email', error: error.response });
  }
})


// Email token verification endpoint
app.post('/verify-email-token', async (req, res) => {
  const data = req.body;
  console.log("Data received: ", data);

  try {
    const user = await pb.collection('users').confirmVerification(data.token);
    console.log("User verified: ", user);
    res.json({ message: 'User Verified', user });
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
app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500');
});
