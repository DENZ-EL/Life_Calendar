// controllers/adminController.js

const User = require('../models/userModel');
const Memory = require('../models/Memory');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { username, email, password, dateOfBirth } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, dateOfBirth });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Attempting to delete user with ID: ${userId}`);

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User with ID ${userId} deleted, now deleting associated memories...`);
    // Delete memories associated with the user
    const result = await Memory.deleteMany({userId});
    console.log(`Deleted ${result.deletedCount} memories associated with user ID ${userId}`);

    res.status(200).json({ message: 'User and associated memories deleted successfully' });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalMemories = async (req, res) => {
  try {
    const totalMemories = await Memory.countDocuments();
    res.json({ totalMemories });
  } catch (error) {
    console.error('Error fetching total memories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
