const express = require('express')
const router = express.Router();
const {
    enrollInCourse,
    getEnrolledCourses
} = require('../controllers/enrollmentCtrl')
const { validateToken, isStudent } = require('../middlewares/validateToken');


router.post('/enrollInCourse', validateToken, isStudent, enrollInCourse)
router.get('/getEnrolledCourses', validateToken, isStudent, getEnrolledCourses)

module.exports = router