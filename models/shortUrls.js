// Import Mongoose library
const mongoose = require('mongoose');
// Import ShortID library for generating short IDs
const shortId = require('shortid');

// Define a new Mongoose schema for short URLs
const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true // Full URL is required
    },

    short: {
        type: String,
        required: true,
        default: shortId.generate // Short URL is generated using ShortID library
    },
    
    clicks: {
        type: Number,
        required: true,
        default: 0 // Number of clicks defaults to 0
    }
});

// Export the Mongoose model named 'ShortUrl' based on the schema
module.exports = mongoose.model('ShortUrl', shortUrlSchema);
