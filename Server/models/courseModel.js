const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    photo1 : {
        type : String,
    },
    photo2 : {
        type : String,
    }

});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
