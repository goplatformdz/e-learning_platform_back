const express = require('express');
const router = express.Router();
const {
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
    searchByLessonName,
    getAllLessonsAdmin
} = require('../controllers/lessonCtrl')
const { validateToken, isAdmin, isStudent } = require('../middlewares/validateToken')

router.post("/addLesson", createLesson);
router.put("/updateLesson/:id", validateToken, updateLesson);
router.delete("/deleteLesson/:id", validateToken, isAdmin, deleteLesson);
router.get("/all-lessons/:id", validateToken, getAllLessons);
router.get("/all-lessons/admin", validateToken, isAdmin, getAllLessonsAdmin);
router.get('/search_lesson', validateToken, searchByLessonName);
router.get("/:id", validateToken, isAdmin, getLesson);

module.exports = router;
