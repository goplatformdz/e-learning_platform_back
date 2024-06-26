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
    
    video: {
        type: String,
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true

    }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
