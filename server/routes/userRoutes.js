// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the user model
const requireAuth = require('../middleware/requireAuth');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Route for user signup
router.post('/signup', async (req, res) => {
  const { username, email, password, dateOfBirth } = req.body;

  try {
    const user = await User.signup(username, email, password, dateOfBirth);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password is correct
    const isValidPassword = await user.isValidPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '3h' });

    // Send token in response
    res.json({ token, dateOfBirth: user.dateOfBirth });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for fetching the user date of birth
router.get('/dateofbirth/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await User.findOne({ _id: userId });
    if(!user) {
      return res.status(404).json({ error: "User not found"});
    }
     // Send the user's date of birth in the response
     res.json({ dateOfBirth: user.dateOfBirth });
    } catch (error) {
      console.error('Error fetching user date of birth:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to fetch the username of the authenticated user
router.get('/username', requireAuth, userController.fetchUsername);

// Route to fetch user profile information
router.get('/profile', requireAuth, userController.getUserProfile);

router.put('/profile/update',requireAuth, userController.updateProfile);

// Delete user account route
router.delete('/profile/delete', requireAuth, userController.deleteAccount);


module.exports = router;
