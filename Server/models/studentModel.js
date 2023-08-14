const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  courseEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
