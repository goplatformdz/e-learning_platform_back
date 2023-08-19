const Lesson = require('../models/lessonModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');

const createLesson = asyncHandler(async (req, res, next) => {
    try {
        const newLesson = await Lesson.create(req.body);
        res.status(200).json({ message: 'Lesson successfully added', data: newLesson });
    } catch (error) {
        return next(new CustomError('Error while creating lesson', 500));
    }
})


const updateLesson = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            id,
            {
                lessonName: req?.body?.lessonName,
                description: req?.body?.description,
                duration: req?.body?.duration,
            },
            {
                new: true,
            }
        );

        if (!lesson) {
            return next(new CustomError(`Couldn't find lesson with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Updated Successfully', data: lesson });
    } catch (error) {
        return next(new CustomError('Error while updating lesson', 500));
    }
});

const getAllLessons = asyncHandler(async (req, res, next) => {
    try {
        const lessons = await Lesson.find({});
        res.status(200).json(lessons);
    } catch (error) {
        return next(new CustomError('Error while fetching lessons', 500));
    }
});

const getLesson = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id);

        if (!lesson) {
            return next(new CustomError(`Couldn't find lesson with the id of ${id}`, 404));
        }

        res.status(200).json(lesson);
    } catch (error) {
        return next(new CustomError('Error while fetching lesson', 500));
    }
});

const searchByLessonName = asyncHandler(async (req, res, next) => {
    try {
        const { lessonName } = req.body;

        if (!lessonName) {
            return next(new CustomError('Lesson name is required.', 500));
        }

        const regex = new RegExp(lessonName, 'i'); // 'i' flag for case-insensitive search

        const result = await Lesson.find({ lessonName: regex });

        res.status(200).json({ success: true, result });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

const deleteLesson = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByIdAndDelete(id);

        if (!lesson) {
            return next(new CustomError(`Couldn't find lesson with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        return next(new CustomError('Error while deleting lesson', 500));
    }
});

module.exports = {
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
    searchByLessonName
}
