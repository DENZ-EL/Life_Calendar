// routes/admin.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthController = require('../controllers/adminAuthController');

// Admin login
router.post('/login', adminAuthController.adminLogin);

// Get all users
router.get('/users', adminController.getAllUsers);

// Add a new user
router.post('/users', adminController.addUser);

// Remove a user
router.delete('/users/:userId', adminController.removeUser);

// Get total amount of memories
router.get('/memories', adminController.getTotalMemories);

module.exports = router;
