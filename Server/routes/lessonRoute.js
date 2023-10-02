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

router.get("/all-lessons-default/:id", getAllLessonsNotLogged);
router.get('/search_lesson', searchByLessonName);
router.get("/:id", getLesson);
router.use(validateToken);
router.get("/all-lessons/:id", getAllLessons);
router.get("/all-lessons/admin/:id", getAllLessonsAdmin);
router.post("/addLesson", createLesson);
router.put("/updateLesson/:id", updateLesson);
router.delete("/deleteLesson/:id", deleteLesson);

module.exports = router;
