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
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
