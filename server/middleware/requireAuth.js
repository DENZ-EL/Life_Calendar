// requireAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // Verify if an authorization token is present in the request headers
  let token = req.headers.authorization;

  // If token is not present in headers, check in local storage
  if (!token && req.headers.localtoken) {
    token = req.headers.localtoken;
  }
  

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  
  try {

    // Remove the "Bearer " prefix from the token
    token = token.replace('Bearer ', '');
    
    
    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Token has expired' });
    }
    const userId = decodedToken._id;

    // Check if the user exists in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Store the user ID in the request object for further processing
    req.user = { _id: userId };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle JWT verification errors
    console.error('JWT verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    res.status(403).json({ error: 'Unauthorized' });
  }
};

module.exports = requireAuth;
