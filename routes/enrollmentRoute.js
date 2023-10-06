const express = require('express')
const router = express.Router();
const {
    enrollInCourse,
    getCoursesByStudent
} = require('../controllers/enrollmentCtrl')
const { validateToken, isStudent } = require('../middlewares/validateToken');


router.post('/enrollInCourse/:course_id', validateToken, isStudent, enrollInCourse)
router.get('/getCoursesByStudent', validateToken, isStudent, getCoursesByStudent)

module.exports = router