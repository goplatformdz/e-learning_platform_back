const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');

const createComment = asyncHandler(async (req, res, next) => {
    try {
        const { lessonId } = req.params
        const { text } = req.body
        const newComment = await Comment.create({
            text,
            lessonId,
            user: req.currentUser.id

        });
        res.status(200).json({ message: 'Comment successfully created', data: newComment });
    } catch (error) {
        next(new CustomError('Error while creating comment', 500));
    }
});

const updateComment = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id)
        if (comment && req.currentUser.id === comment.user._id.toString()) {
            const updatedComment = await Comment.findByIdAndUpdate(
                id,
                {
                    text: req?.body?.text,

                },
                {
                    new: true,
                }
            );

            if (!updatedComment) {
                return next(new CustomError(`Couldn't find comment with the id of ${id}`, 404));
            }

            res.status(200).json({ message: 'Comment updated successfully', data: updatedComment });
        } else {
            if (!comment) {
                return next(new CustomError(`Comment with the id of ${id} not found`, 404));
            } else {
                return next(new CustomError('You dont have the right to edit this comment', 401));

            }
        }

    } catch (error) {
        next(new CustomError('Error while updating comment', 500));
    }
});

const getCommentsByLesson = asyncHandler(async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const comments = await Comment.find({ lessonId }).populate('user').populate('lessonId');
        if (!comments) {
            return next(new CustomError(`Couldn't find comment with the id of ${lessonId}`, 404));
        }
        res.status(200).json(comments);
    } catch (error) {
        next(new CustomError('Error while fetching comments', 500));
    }
});



const getComment = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id).populate('user');

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
        const comment = await Comment.findById(id)
        const user = await User.findById(req.currentUser.id)
        if (user && comment && (req.currentUser.id === comment.user._id.toString() || user.role === 'admin')) {
            const deletedComment = await Comment.findByIdAndDelete(id);

            if (!deletedComment) {
                return next(new CustomError(`Couldn't find comment with the id of ${id}`, 404));
            }

            res.status(200).json({ message: 'Comment deleted successfully', data: deletedComment });
        } else {
            if (!comment) {
                return next(new CustomError(`Comment with the id of ${id} not found`, 404));
            } else {
                return next(new CustomError('You dont have the right to edit this comment', 401));

            }
        }
    } catch (error) {
        next(new CustomError('Error while deleting comment', 500));
    }
});

module.exports = {
    createComment,
    getCommentsByLesson,
    updateComment,
    getComment,
    deleteComment,
};
