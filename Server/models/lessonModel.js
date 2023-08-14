const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    lessonName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
