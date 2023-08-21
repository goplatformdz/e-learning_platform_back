const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
    searchByCourseName,
    getCoursesByCategory
} = require('../controllers/courseCtrl');
const { validateToken, isAdmin } = require('../middlewares/validateToken');


router.post("/addCourse", validateToken, isAdmin, createCourse);
router.put("/updateCourse/:id", validateToken, isAdmin, updateCourse);
router.delete("/deleteCourse/:id", validateToken, isAdmin, deleteCourse);
router.get("/all-courses", validateToken, getAllCourses);
router.get('/search_course', validateToken, searchByCourseName);
router.get("/getCourse/:id", validateToken, isAdmin, getCourse);
router.get("/coursesByCategory", validateToken, getCoursesByCategory);



module.exports = router;
