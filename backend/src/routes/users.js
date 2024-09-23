const express = require('express');
const router = express.Router();

// Fetch all users, admin only
router.get('/', async (req, res) => {
  try {
    // const records = await pb.collection('users').getFullList();
    res.json({message: 'Users fetched successfully', records: []}) // Temporary empty array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Fetch single user, admin and requested user (the user logged in and with the same id being requested) only
router.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      // const record = await pb.collection('users').getOne(id);
      res.json({message: 'User fetched successfully', user: {}}) // Temporary empty object
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      // const record = await pb.collection('users').update(id, data);
      res.json({ message: 'User updated successfully', user: {} }); // Temporary empty object
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      // await pb.collection('users').delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
  });

module.exports = router;