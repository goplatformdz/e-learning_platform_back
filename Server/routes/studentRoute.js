const express = require('express');
const Student = require('../models/studentModel');
const router = new express.Router();
const mongoose = require('mongoose');

router.post('/addStudent', async (req, res) => {
    try {
        await Student.create(req.body)
        res.status(200).json({ message: 'Student successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/updateStudent/:id', async (req, res) => {
    try {
        const { id } = req.params
        const student = await Student.findByIdAndUpdate(id, req.body)
        if (!student) {
            res.status(404).json({ message: `Couldn't find student with the id of ${id}` })
        }
        const updatedStudent = await Student.findById(id)
        res.status(200).json(updatedStudent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get('/students', async (req, res) => {
    try {
        const students = await Student.find({})
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/students/:id', async (req, res) => {
    try {
        const { id } = req.params
        const student = await Course.findById(id)
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteStudent/:id', async (req, res) => {
    try {
        const { id } = req.params
        const student = await Course.findByIdAndDelete(id)
        if (!student) {
            res.status(404).json({ message: `Couldn't find student with the id of ${id}` })
        }
        res.status(200).json({ message: 'Student deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router