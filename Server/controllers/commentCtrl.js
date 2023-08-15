const express = require('express');
const Comment = require('../models/commentModel');
const router = express.Router();
const mongoose = require('mongoose');

const createComment = async (req, res) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(200).json({ message: 'Comment successfully created', data: newComment });
    } catch (error) {
        throw new Error(error);
    }
}

const updateComment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedComment = await Comment.findByIdAndUpdate(id, {
            text: req?.body?.text,
        },
            {
                new: true
            });
        if (!updatedComment) {
            const error = new Error(`Couldn't find comment with the id of ${id}`);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Comment updated successfully', data: updatedComment });
    } catch (error) {
        throw new Error(error);
    }
}

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.status(200).json(comments);
    } catch (error) {
        throw new Error(error);
    }
}

const getComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            const error = new Error(`Couldn't find comment with the id of ${id}`);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(comment);
    } catch (error) {
        throw new Error(error);
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            const error = new Error(`Couldn't find comment with the id of ${id}`);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createComment,
    getAllComments,
    updateComment,
    getComment,
    deleteComment,
}
