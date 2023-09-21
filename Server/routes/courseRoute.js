const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
    searchByCourseName,
    getCoursesByCategory,
    getRecommendedCourses

} = require('../controllers/courseCtrl');
const { validateToken, isAdmin } = require('../middlewares/validateToken');


router.post("/addCourse", validateToken, isAdmin, createCourse);
router.put("/updateCourse/:id", validateToken, isAdmin, updateCourse);
router.delete("/deleteCourse/:id", validateToken, isAdmin, deleteCourse);
router.get("/all-courses", getAllCourses);
router.post('/search_course', searchByCourseName);
router.get("/getCourse/:id", validateToken, isAdmin, getCourse);
router.post("/coursesByCategory", getCoursesByCategory);
router.get('/recommended-courses', validateToken, getRecommendedCourses);





module.exports = router;
