const express = require('express');
const router = express.Router();
const {
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
    searchByLessonName,
    getAllLessonsAdmin,
    getAllLessonsNotLogged
} = require('../controllers/lessonCtrl')
const { validateToken, isAdmin, isStudent } = require('../middlewares/validateToken')

router.post("/addLesson", createLesson);
router.put("/updateLesson/:id", updateLesson);
router.delete("/deleteLesson/:id", deleteLesson);
router.get("/all-lessons/:id", validateToken, getAllLessons);
router.get("/all-lessons-default/:id", getAllLessonsNotLogged);
router.get("/all-lessons/admin/:id", getAllLessonsAdmin);
router.get('/search_lesson', searchByLessonName);
router.get("/:id", validateToken, getLesson);

module.exports = router;
