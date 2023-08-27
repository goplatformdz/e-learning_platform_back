const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const asyncHandler = require('express-async-handler');
const CustomError = require('../utils/customError');
const User = require('../models/userModel')


// Create an enrollment for a student in a course
const enrollInCourse = asyncHandler(async (req, res, next) => {
    const { course_id } = req.params;

    try {
        // Find the course by its ID
        const course = await Course.findById(course_id);
        if (!course) {
            return next(new CustomError('Course not found', 404));
        }

        const userId = req.currentUser.id

        const EnrollmentUser = await Enrollment.find({student:userId})
        if(EnrollmentUser.length===0)
        {
            console.log("0");
            const enrollment = await Enrollment.create({
                student:userId ,
                course: course._id
            });
            console.log(enrollment);
        }
        else {
            console.log("1");

            const update = await Enrollment.findOneAndUpdate(
                { student: userId },
                { $addToSet: { course: course._id } },
                { new: true }
            );
        }
        // Create an enrollment for the student in the course
        

        // Update the user's enrolledCourses field
        /* await User.findByIdAndUpdate(req.currentUser.id, {
            $addToSet: { enrolledCourses: course._id } // Add the course to the enrolledCourses array
        });*/

        res.status(200).json("sucess");
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});



// Get the list of courses enrolled by a student
const getCoursesByStudent = asyncHandler(async (req, res, next) => {
    try {

        // Find the enrolled courses for the student
        const enrolledCourses = await Enrollment.find(
            { student: req.currentUser.id, course: { $ne: null } },
            { _id: 0, student: 0 })
            .populate('course');

        const flattenedCourses = enrolledCourses.flatMap(item => item.course);

        if (enrolledCourses.length === 0) {
            next(new CustomError('No enrolled courses found for the student', 404));
        }

        res.status(200).json(flattenedCourses);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

module.exports = {
    enrollInCourse,
    getCoursesByStudent
};
