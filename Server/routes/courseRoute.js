const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    updateCourse,
    getCourse,
    deleteCourse,
} = require('./controllers/courseCtrl');

router.post("/addCourse", createCourse);
router.put("/updateCourse/:id", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);
router.get("/all-courses", getAllCourses);
router.get("/:id", getCourse);

module.exports = router;
