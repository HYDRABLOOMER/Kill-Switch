const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    scanHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scan'
    }]
}, {
    timestamps: true
});

// Drop any existing indexes
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema); 