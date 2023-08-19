const Comment = require('../models/commentModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');

const createComment = asyncHandler(async (req, res, next) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(200).json({ message: 'Comment successfully created', data: newComment });
    } catch (error) {
        next(new CustomError('Error while creating comment', 500));
    }
});

const updateComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            {
                text: req?.body?.text,
                lesson_id: req?.body?.lesson_id

            },
            {
                new: true,
            }
        );

        if (!updatedComment) {
            return next(new CustomError(`Couldn't find comment with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Comment updated successfully', data: updatedComment });
    } catch (error) {
        next(new CustomError('Error while updating comment', 500));
    }
});

const getAllComments = asyncHandler(async (req, res, next) => {
    try {
        const comments = await Comment.find({});
        res.status(200).json(comments);
    } catch (error) {
        next(new CustomError('Error while fetching comments', 500));
    }
});

const getComment = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return next(new CustomError(`Couldn't find comment with the id of ${id}`, 404));
        }

        res.status(200).json(comment);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

const deleteComment = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return next(new CustomError(`Couldn't find comment with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(new CustomError('Error while deleting comment', 500));
    }
});

module.exports = {
    createComment,
    getAllComments,
    updateComment,
    getComment,
    deleteComment,
};
