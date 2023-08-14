const express = require('express');
const Student = require('../models/studentModel');
const router = new express.Router();
const mongoose = require('mongoose');

router.post('/addStudent', async (req, res) => {
    try {
        const user = await Student.create(req.body)
        res.status(200).json({ message: 'User successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router