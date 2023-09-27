const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Notification = require('../models/notificationModel');
const Enrollment = require('../models/enrollmentModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dqwbtcthz', 
  api_key: '412811566196319', 
  api_secret: 'J-nBiGA6QX7weGf7WVEIPwhwioo' 
});




const createCourse = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find({});
        const { courseName, description, instructor, categoryName } = req.body;
        const {image1} = req.files
        const {image2} = req.files
        


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
        const  R1 = await uploadImage(image1)
        const  R2 = await uploadImage(image2)
        const url1 = R1.url
        const url2 = R2.url

       console.log(url1,url2);
       

        const category = await Category.findOne({ name: categoryName });
        if (!category) return next(new CustomError(`Category with the name of ${categoryName} does not exist`, 404));

        const newCourse = await Course.create({
            courseName,
            description,
            instructor,
            category: category._id,
            photo1: url1,// Add the photo attribute to the Course model
            photo2 : url2
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

        res.status(200).json({ message: 'Course successfully created', data: { newCourse, notifications } });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

const updateCourse = asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { courseName, description, instructor, categoryName } = req.body;
  
      const category = await Category.findOne({ name: categoryName });
      if (!category) return next(new CustomError(`Category with the name of ${categoryName} does not exist`, 404));
  
      // Check if there are uploaded images in the request
      const { image1, image2 } = req.files;
  
      // Function to upload an image to Cloudinary
      function uploadImage(imageData) {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {},
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(imageData.data);
        });
      }
  
      // Upload images if they exist in the request
      let url1 = null;
      let url2 = null;
  
      if (image1) {
        const R1 = await uploadImage(image1);
        url1 = R1.url;
      }
  
      if (image2) {
        const R2 = await uploadImage(image2);
        url2 = R2.url;
      }
  
      // Update the course, including image URLs if they were uploaded
      const updateFields = {
        courseName,
        description,
        instructor,
        category: category._id
      };
  
      if (url1) {
        updateFields.photo1 = url1;
      }
  
      if (url2) {
        updateFields.photo2 = url2;
      }
  
      const course = await Course.findByIdAndUpdate(
        id,
        updateFields,
        {
          new: true,
        }
      );
  
      if (!course) {
        return next(new CustomError(`Couldn't find course with the id of ${id}`, 404));
      }
  
      res.status(200).json({ message: 'Course updated successfully', data: course });
    } catch (error) {
      next(new CustomError('Error while updating course', 500));
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
        const numberOfRecommendations = 5; // Define the number of courses to recommend
        // Retrieve all courses from the database
        const courses = await Course.find();
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






module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
    searchByCourseName,
    getCoursesByCategory,
    getRecommendedCourses

};