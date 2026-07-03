const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model

exports.isAuthenticated = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user details to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    // Differentiate between invalid/expired token and other errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }

    res.status(401).json({ message: 'Invalid token' });
  }
};
