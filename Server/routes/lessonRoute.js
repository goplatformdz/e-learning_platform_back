const express = require('express');
const router = express.Router();
const {
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
} = require('../controllers/lessonCtrl')

router.post("/addLesson", createLesson);
router.put("/updateLesson/:id", updateLesson);
router.delete("/deleteLesson/:id", deleteLesson);
router.get("/all-lessons", getAllLessons);
router.get("/:id", getLesson);

module.exports = router;
