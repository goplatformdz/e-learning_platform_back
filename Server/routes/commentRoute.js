const express = require('express');
const Comment = require('../models/commentModel');
const router = new express.Router();
const mongoose = require('mongoose');



router.post('/addComment', async (req, res) => {
    try {
        await Comment.create(req.body)
        res.status(200).json({ message: 'Comment successfully added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/updateComment/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findByIdAndUpdate(id, req.body)
        if (!comment) {
            res.status(404).json({ message: `Couldn't find comment with the id of ${id}` })
        }
        const updatedComment = await Comment.findById(id)
        res.status(200).json(updatedComment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find({})
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findById(id)
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteComment/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findByIdAndDelete(id)
        if (!comment) {
            res.status(404).json({ message: `Couldn't find comment with the id of ${id}` })
        }
        res.status(200).json({ message: 'Comment deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router