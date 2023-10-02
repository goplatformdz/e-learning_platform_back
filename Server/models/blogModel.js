const mongoose = require('mongoose');

// Define the schema for the Blog Post
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    photo1: {
        type: String,
    },
    photo2: {

        type: String,
    },

    createdAt: {
        type: Date,
        default:
            Date.now
        ,
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog; 