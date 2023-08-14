const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Course = require('./models/courseModel');

app.use(express.json());

app.post('/addUser', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json({ message: 'User successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

////////////////////////////////

app.post('/addCourse', async (req, res) => {
    try {
        const course = await Course.create(req.body)
        res.status(200).json({ message: 'Course successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.put('/updateCourse/:id', async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findByIdAndUpdate(id, req.body)
        if (!course) {
            res.status(404).json({ message: `Couldn't find course with the id of ${id}` })
        }
        const updatedCourse = await Course.findById(id)
        res.status(200).json(updatedCourse)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({})
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)
        res.status(200).json(course)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.delete('/deleteCourse/:id', async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findByIdAndDelete(id)
        if (!course) {
            res.status(404).json({ message: `Couldn't find course with the id of ${id}` })
        }
        res.status(200).json({ message: 'Course deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})