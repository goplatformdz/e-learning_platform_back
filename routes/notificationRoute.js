const express = require('express');
const router = express.Router();
const {
    getNotifications,
} = require('../controllers/notificationCtrl');
const { validateToken, isStudent } = require('../middlewares/validateToken');

router.get('/', validateToken, isStudent, getNotifications)


module.exports = router