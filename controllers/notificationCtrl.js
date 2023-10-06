
const Notification = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');


const getNotifications = asyncHandler(async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.currentUser.id }, { _id: 0 });
        res.status(200).json(notifications);
    } catch (error) {
        return next(new CustomError('Error while fetching notifications', 500));
    }
});

module.exports = { getNotifications }