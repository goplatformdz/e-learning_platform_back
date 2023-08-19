const express = require('express');
const router = express.Router();
const {
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
    searchByLessonName
} = require('../controllers/lessonCtrl')
const { validateToken, isAdmin } = require('../middlewares/validateToken')

router.use(validateToken)
router.post("/addLesson", validateToken, isAdmin, createLesson);
router.put("/updateLesson/:id", validateToken, isAdmin, updateLesson);
router.delete("/deleteLesson/:id", validateToken, isAdmin, deleteLesson);
router.get("/all-lessons", validateToken, getAllLessons);
router.get('/search_lesson', validateToken, searchByLessonName);
router.get("/:id", validateToken, isAdmin, getLesson);

module.exports = router;
