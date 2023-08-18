const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
    getAllCoursesForCurrentStudent,
    searchByCourseName
} = require('../controllers/courseCtrl');
const { validateToken } = require('../middleWares/validateToken');

router.use(validateToken)
router.post("/addCourse", createCourse);
router.put("/updateCourse/:id", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);
router.get("/all-courses", getAllCourses);
router.get("/all-courses/byStudent", getAllCoursesForCurrentStudent);
router.get('/serch_course',searchByCourseName);
router.get("/:id", getCourse);


module.exports = router;
