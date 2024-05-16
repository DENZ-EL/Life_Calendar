
const User = require('../models/userModel');
const Memory = require('../models/Memory');
const bcrypt = require('bcrypt');



const fetchUsername = async (req, res) => {
    try {
      // Fetch the authenticated user's ID from the request object
      const userId = req.user._id;

      // Retrieve the user from the database using the user ID
      const user = await User.findById(userId);

      // If user is found, send back the username in the response
      if (user) {
        res.status(200).json({ username: user.username });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

  };

// UserController.js
const getUserProfile = async (req, res) => {
    try {
      // Fetch user information based on the user's ID
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Send user information in the response
      res.status(200).json({
        username: user.username,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  const updateProfile = async (req, res) => {
    try {
      const { username, email, password, dateOfBirth } = req.body;
      const userId = req.user._id;
  
      // Find the user by ID
      let user = await User.findById(userId);
  
      // Update the user fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) {
        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth); // Parse date of birth
  
      // Save the updated user
      user = await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const deleteAccount = async (req, res) => {
    try {
      const userId = req.user._id;
      // Delete user from the database
      await User.findByIdAndDelete(userId);
      // Delete memories associated with the user
      await Memory.deleteMany({ userId });
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
  
  module.exports = { 
    getUserProfile,
    updateProfile,
    deleteAccount,
    fetchUsername
 };
  