const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'cyberpbl_secret_key_2024';

const authMiddleware = async (req, res, next) => {
    try {
        console.log('Authenticating request:', {
            path: req.path,
            method: req.method,
            cookies: req.cookies
        });

        // Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decoded:', { userId: decoded.userId });
        
        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            console.log('User not found for ID:', decoded.userId);
            return res.status(401).json({ error: 'User not found' });
        }

        console.log('User authenticated:', { userId: user._id, email: user.email });

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    authMiddleware
}; 