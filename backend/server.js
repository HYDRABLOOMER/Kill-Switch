const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// ✅ Define 'app' first BEFORE using it
const app = express();

const PORT = 5000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/cyberpbl';
const JWT_SECRET = 'cyberpbl_secret_key_2024';

// Routes
const userRoutes = require('./routes/userRoutes');
const scanRoutes = require('./routes/scanRoutes');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// ✅ API Routes AFTER middleware
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
    });
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
