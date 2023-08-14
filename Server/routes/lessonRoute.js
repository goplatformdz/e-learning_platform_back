const express = require('express');
const Lesson = require('../models/lessonModel');
const router = new express.Router();
const mongoose = require('mongoose');



router.post('/addLesson', async (req, res) => {
    try {
        await Lesson.create(req.body)
        res.status(200).json({ message: 'Lesson successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/updateLesson/:id', async (req, res) => {
    try {
        const { id } = req.params
        const lesson = await Lesson.findByIdAndUpdate(id, req.body)
        if (!lesson) {
            res.status(404).json({ message: `Couldn't find lesson with the id of ${id}` })
        }
        const updatedLesson = await Lesson.findById(id)
        res.status(200).json(updatedLesson)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get('/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find({})
        res.status(200).json(lessons)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params
        const lesson = await Lesson.findById(id)
        res.status(200).json(lesson)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteLesson/:id', async (req, res) => {
    try {
        const { id } = req.params
        const lesson = await Lesson.findByIdAndDelete(id)
        if (!lesson) {
            res.status(404).json({ message: `Couldn't find lesson with the id of ${id}` })
        }
        res.status(200).json({ message: 'Lesson deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router