const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },

});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
