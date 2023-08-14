const express = require('express');
const User = require('../models/userModel');
const router = new express.Router();
const mongoose = require('mongoose');

router.post('/addUser', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json({ message: 'User successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router