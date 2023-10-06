const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel')

const addMessage = asyncHandler(async (req, res, next) => {
    try {
        const { chatroom_id, sender_id, message } = req.body

        const data = await Message.create({
            chatroom_id,
            sender_id,
            message
        })
        if (data) {
            res.status(200).json({ message: 'Message successfully added', data });
        }
        return next(new CustomError('Empty message', 404));
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
});

const getMessages = asyncHandler(async (req, res, next) => {
    try {
        const { chatroom_id } = req.params
        const messages = await Message.find({ chatroom_id })
        res.status(200).json({ messages });

    } catch (error) {
        return next(new CustomError(error.message, 500));

    }
})


module.exports = {
    getMessages,
    addMessage

};