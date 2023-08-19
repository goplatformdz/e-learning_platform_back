const express = require('express')
const router = express.Router();
const {
    addCourseToCategory,
    getCoursesByCategory
} = require('../controllers/categoryCourseCtrl');
const { validateToken, isAdmin } = require('../middlewares/validateToken');




router.post("/addCourseToCategory/:courseId", validateToken, isAdmin, addCourseToCategory);
router.get("/coursesByCategory/:categoryId", validateToken, getCoursesByCategory);

module.exports = router;