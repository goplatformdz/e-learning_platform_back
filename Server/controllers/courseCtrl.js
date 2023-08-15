const express = require('express');
const Course = require('../models/courseModel');
const router = new express.Router();
const mongoose = require('mongoose');

const createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(200).json({ message: 'Course successfully created', data: newCourse });
    } catch (error) {
        throw new Error(error);
    }
}

const updateCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByIdAndUpdate(id, {
            courseName: req?.body?.courseName,
            description: req?.body?.description,
            instructor: req?.body?.instructor,
        },
            {
                new: true
            });
        if (!course) {
            const error = new Error(`Couldn't find course with the id of ${id}`);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Course updated successfully', data: course });
    } catch (error) {
        throw new Error(error);
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        throw new Error(error);
    }
}

const getCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            const error = new Error(`Couldn't find course with the id of ${id}`);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(course);
    } catch (error) {
        throw new Error(error);
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            const error = new Error(`Couldn't find course with the id of ${id}`);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
}
