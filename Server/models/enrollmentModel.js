const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema({
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    }]
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
