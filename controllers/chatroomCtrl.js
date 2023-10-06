const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const Chatroom = require('../models/chatroomModel')

const createChatRoom = asyncHandler(async (req, res, next) => {
    try {
        const { receiver_id } = req.body

        const chatroom = await Chatroom.create({
            members: [req.currentUser.id, receiver_id],
        })
        if (chatroom) {
            res.status(200).json({ message: 'Chatroom successfully created', chatroom });
        }
        return next(new CustomError('Empty chatroom', 404));
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
});

const getChatrooms = asyncHandler(async (req, res, next) => {
    try {

        const chatrooms = await Chatroom.find({ members: { $in: [req.currentUser.id] } })
        res.status(200).json({ chatrooms });

    } catch (error) {
        return next(new CustomError(error.message, 500));

    }
})

const findChatroom = asyncHandler(async (req, res, next) => {
    try {
        const { first_id, second_id } = req.params
        const chatroom = await Chatroom.findOne({ members: { $all: [first_id, second_id] } })
        res.status(200).json({ chatroom });

    } catch (error) {
        return next(new CustomError(error.message, 500));

    }
})
module.exports = {
    createChatRoom,
    getChatrooms,
    findChatroom,

};