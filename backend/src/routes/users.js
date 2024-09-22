import express, { Router } from "express";
import { pb } from "../server.js";


export const usersRouter = Router();


// Fetch all users, admin only
usersRouter.get('/', async (req, res) => {
  try {
    const records = await pb.collection('users').getFullList();
    res.json({message: 'Users fetched successfully', records})
  } catch (error) {
    console.log(error.response)
    res.status(error.status).json({ message: 'Failed to fetch users', error: error.response });
  }
})

// Fetch single user, admin and requested user (the user logged in and with the same id being requested) only
usersRouter.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    try {
    const record = await pb.collection('users').getOne(id);
    res.json({message: 'User fetched successfully', user: record})
  } catch (error) {
    console.log(error.response)
    res.status(error.status).json({ message: 'Failed to fetch user', error: error.response });
  }
}).put(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const record = await pb.collection('users').update(id, data);
    res.json({ message: 'User updated successfully', user: record });
  } catch (error) {
    res.status(error.status).json({ message: 'Failed to update user', error: error.response });
  }
}).delete(async (req, res) => {
  try {
    await pb.collection('users').delete(req.params.id);
    res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(error.status).json({ message: 'Failed to delete user', error: error.response });
    }
  })



export default usersRouter;