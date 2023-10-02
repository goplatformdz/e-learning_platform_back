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

router.post('/search_course', searchByCourseName);

router.get("/getCourse/:id", getCourse);
router.post("/coursesByCategory", getCoursesByCategory);
router.get('/recommended-courses', getRecommendedCourses);
router.get("/all-courses", getAllCourses);
router.use(validateToken);
router.post("/addCourse", createCourse);
router.put("/updateCourse/:id", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);






module.exports = router;
