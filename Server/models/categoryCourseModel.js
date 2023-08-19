const mongoose = require('mongoose');

const categoryCourseSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
});

const CategoryCourse = mongoose.model('CategoryCourse', categoryCourseSchema);

module.exports = CategoryCourse;