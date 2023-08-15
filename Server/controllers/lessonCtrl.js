const express = require('express');
const Lesson = require('../models/lessonModel');
const router = new express.Router();
const mongoose = require('mongoose');

const createLesson = async (req, res) => {
    try {
        const newLesson = await Lesson.create(req.body)
        res.status(200).json({ message: 'Lesson successfully registered', data: newLesson })
    } catch (error) {
        throw new Error(error)
    }
}


const updateLesson = async (req, res) => {
    const { id } = req.params
    try {
        const lesson = await Lesson.findByIdAndUpdate(id, {
            lessonName: req?.body?.lessonName,
            description: req?.body?.description,
            duration: req?.body?.duration,
        },
            {
                new: true
            })
        if (!lesson) {
            const error = new Error(`Couldn't find lesson with the id of ${id}`)
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ message: 'Updated Successfully', data: lesson })
    } catch (error) {
        throw new Error(error)
    }
}


const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({})
        res.status(200).json(lessons)
    } catch (error) {
        throw new Error(error)
    }
}

const getLesson = async (req, res) => {
    try {
        const { id } = req.params
        const lesson = await Lesson.findById(id)
        if (!lesson) {
            const error = new Error(`Couldn't find lesson with the id of ${id}`)
            error.statusCode = 404
            throw error
        }
        res.status(200).json(lesson);
    } catch (error) {
        throw new Error(error)
    }
}

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params
        const lesson = await Lesson.findByIdAndDelete(id)
        if (!lesson) {
            const error = new Error(`Couldn't find lesson with the id of ${id}`)
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ message: 'Lesson deleted successfully' })
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
}