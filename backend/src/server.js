import PocketBase from 'pocketbase';
import express from 'express';
import cors from 'cors';


// Initialize PocketBase as Databse
const pb = new PocketBase('http://127.0.0.1:8090');
const app = express();

// Set CORS headers
app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json());


// Server testing endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Server is up and running!'
  })
});



// Create user document
app.post('/user-signup', async (req, res) => {
  const data = req.body;
  console.log(data)

  try {
    const user = await pb.collection('users').create(data);
    console.log("User: ", user)
    res.json({ message: 'User created successfully', user });
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: 'Failed to create user', error: error.response });
  }
})


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


// Fetch all users, admin only
app.get('/users', async (req, res) => {
  try {
    const records = await pb.collection('users').getFullList();
    res.json({message: 'Users fetched successfully', records})
  } catch (error) {
    console.log(error.response)
    res.status(error.status).json({ message: 'Failed to fetch users', error: error.response });
  }
})


// Fetch single user, admin and requested user (the user logged in and with the same id being requested) only
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const record = await pb.collection('users').getOne(id);
    res.json({message: 'User fetched successfully', record})
  } catch (error) {
    console.log(error.response)
    res.status(500).json({ message: 'Failed to fetch user', error: error.response });
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

// Running server
app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500');
});
