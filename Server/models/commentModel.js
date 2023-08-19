const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true

    }

});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
