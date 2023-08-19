const Course = require('../models/courseModel');
const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const CustomError = require('../utils/customError');
const CategoryCourse = require('../models/categoryCourseModel');



// Create an enrollment for a student in a course
const addCourseToCategory = asyncHandler(async (req, res, next) => {

    const { courseId } = req.params
    const { categoryName } = req.body;

    try {
        // Find the course by its ID
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new CustomError('Course not found', 404));
        }

        // Find the category by its name
        const category = await Category.findOne({ name: categoryName });
        if (!category) return next(new CustomError(`Category with the name of ${categoryName} is not found`, 404))



        // Create an enrollment for the student in the course
        const categoryCourse = await CategoryCourse.create({
            category: category._id,
            course: course._id,
        })


        res.status(200).json(categoryCourse);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

// Get all courses within a category
const getCoursesByCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;

    try {
        // Find the category by its ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(new CustomError(`Couldn't find category with the id of ${id}`, 404));
        }

        // Find the enrolled courses for the student
        const categoryCourses = await CategoryCourse.find(
            { category: category._id, course: { $ne: null } },
            { _id: 0, category: 0 })
            .populate('course');

        const flattenedCategoryCourses = categoryCourses.flatMap(item => item.course);

        if (categoryCourses.length === 0) {
            next(new CustomError('No courses found for this category', 404));
        }

        res.status(200).json(flattenedCategoryCourses);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

module.exports = {
    addCourseToCategory,
    getCoursesByCategory
}