const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Notification = require('../models/notificationModel');
const Enrollment = require('../models/enrollmentModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});




const createCourse = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find({});
        const { courseName, description, instructor, categoryName } = req.body;
        const { image1 } = req.files
        const { image2 } = req.files



        function uploadImage(imageData) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                    },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result);
                            // You can access the public URL of the uploaded image using result.url
                        }
                    }
                ).end(imageData.data);
            });
        }
        const R1 = await uploadImage(image1)
        const R2 = await uploadImage(image2)
        const url1 = R1.url
        const url2 = R2.url

        console.log(url1, url2);


        const category = await Category.findOne({ name: categoryName });
        if (!category) return next(new CustomError(`Category with the name of ${categoryName} does not exist`, 404));

        const newCourse = await Course.create({
            courseName,
            description,
            instructor,
            category: category._id,
            photo1: url1,// Add the photo attribute to the Course model
            photo2: url2
        });


        // Create a notification for each user
        const notifications = []
        for (const user of users) {
            if (user.role === 'student') {
                const notification = await Notification.create({
                    user: user._id,
                    course_id: newCourse._id,
                    message: `Hey ${user.firstname}, check out our brand new ${category.name} course by ${newCourse.instructor}: ${newCourse.courseName}`
                });
                notifications.push(notification)
            }
        }

        res.status(200).json({ message: 'Course successfully created', data: { newCourse } });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

const updateCourse = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { courseName, description, instructor, categoryName } = req.body;
        const { image1, image2 } = req.files ? req.files : '';


        // Check if the course with the given ID exists
        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            return next(new CustomError(`Course with the ID ${id} does not exist`, 404));
        }

        // Upload images to Cloudinary
        function uploadImage(imageData) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(imageData.data);
            });
        }


        let url1 = ''
        let url2 = '';
        if (image1) {
            const R1 = await uploadImage(image1);

            url1 = R1.url;
        }

        if (image2) {

            const R2 = await uploadImage(image2);
            url2 = R2.url;
        }

        console.log(url1, url2);

        // Find the category by name
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return next(new CustomError(`Category with the name of ${categoryName} does not exist`, 404));
        }

        const courseFounded = await Course.findById(id);


        // Update the course with the new data
        existingCourse.courseName = courseName;
        existingCourse.description = description;
        existingCourse.instructor = instructor;
        existingCourse.category = category._id;
        existingCourse.photo1 = url1 ? url1 : courseFounded.photo1;
        existingCourse.photo2 = url2 ? url2 : courseFounded.photo2;

        // Save the updated course
        const updatedCourse = await existingCourse.save();

        res.status(200).json({ message: 'Course successfully updated', data: { updatedCourse } });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});


const searchByCourseName = asyncHandler(async (req, res, next) => {
    try {
        const { courseName } = req.body;

        if (!courseName) {
            return next(new CustomError('Course name is required.', 500));
        }

        const regex = new RegExp(courseName, 'i'); // 'i' flag for case-insensitive search

        const result = await Course.find({ courseName: regex }).populate('category');

        res.status(200).json({ success: true, result });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

const getAllCourses = asyncHandler(async (req, res, next) => {
    try {
        const courses = await Course.find({}).populate('category');
        res.status(200).json(courses);
    } catch (error) {
        next(new CustomError('Error while fetching courses', 500));
    }
});




const getCourse = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(new CustomError(`Couldn't find course with the id of ${id}`, 404));
        }

        res.status(200).json(course);
    } catch (error) {
        next(new CustomError('Error while fetching course', 500));
    }
});


const getCoursesByCategory = asyncHandler(async (req, res, next) => {
    try {
        const { categoryName } = req.body;


        const category = await Category.findOne({ name: categoryName });
        if (!category) return next(new CustomError(`Category with the name of ${categoryName} does not exist`, 404));

        const courses = await Course.find({ category: category._id }).populate('category');

        res.status(200).json(courses);
    } catch (error) {
        next(new CustomError('Error while fetching courses by category', 500));
    }
});


const deleteCourse = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return next(new CustomError(`Couldn't find course with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        next(new CustomError('Error while deleting course', 500));
    }
});


const getRecommendedCourses = async (req, res, next) => {
    try {
        const numberOfRecommendations = 4; // Define the number of courses to recommend
        // Retrieve all courses from the database
        const courses = await Course.find().populate('category');
        // Retrieve the enrollments count for each course
        const courseEnrollmentCounts = await Promise.all(
            courses.map(async (course) => {
                const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
                return { course, enrollmentCount };
            })
        );
        // Sort the courses based on the enrollment counts in descending order
        const sortedCourses = courseEnrollmentCounts.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        // Select the top recommended courses from the sorted list
        const recommendedCourses = sortedCourses.slice(0, numberOfRecommendations).map((item) => item.course);
        res.status(200).json(recommendedCourses);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

const getMyCourses = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ student: req.currentUser.id }, { _id: 0, student: 0 });

        // Retrieve the courses for each enrollment
        const myCoursesPromises = enrollments.map(async (enrollment) => {
            const courseIds = enrollment.course;
            const courses = await Course.find({ _id: { $in: courseIds } }).populate('category');
            return courses;
        });

        const myCourses = await Promise.all(myCoursesPromises);

        res.status(200).json(myCourses);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};







module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
    searchByCourseName,
    getCoursesByCategory,
    getRecommendedCourses,
    getMyCourses

};