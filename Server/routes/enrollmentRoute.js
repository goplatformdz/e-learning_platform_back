const express = require('express')
const router = express.Router();
const {
    enrollInCourse,
    getCoursesEnrolledByStudent
} = require('../controllers/enrollmentCtrl')
const { validateToken, isStudent } = require('../middlewares/validateToken');


router.post('/enrollInCourse/:course_id', validateToken, isStudent, enrollInCourse)
router.get('/getCoursesEnrolledByStudent', validateToken, isStudent, getCoursesEnrolledByStudent)

module.exports = router