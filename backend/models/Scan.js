const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    target: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
       enum: ['port', 'xss', 'sql', 'malicious', 'clickjacking', 'cve', 'webscraper', 'vulnerability' ]

    },
    result: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Scan', scanSchema); 