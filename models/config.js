// Import Mongoose library
const mongoose = require('mongoose');

// Define a new Mongoose schema for user login
const LoginSchema = new mongoose.Schema({
    email: {
        type: String, // Email field type is String
        required: true // Email field is required
    },
    password: {
        type: String, // Password field type is String
        required: true // Password field is required
    }
});

// Create a Mongoose model based on the schema, named "users"
const collection = new mongoose.model("users", LoginSchema);

// Export the Mongoose model to be used in other files
module.exports = collection;
