const express = require('express');
const router = express.Router();
const {
    createComment,
    getCommentsByLesson,
    updateComment,
    getComment,
    deleteComment,
} = require('../controllers/commentCtrl');
const { validateToken } = require('../middlewares/validateToken');


router.post("/addComment/:lessonId", validateToken, createComment);
router.put("/updateComment/:id", validateToken, updateComment);
router.delete("/deleteComment/:id", validateToken, deleteComment);
router.get("/all-comments/:lessonId", validateToken, getCommentsByLesson);
router.get("/:id", validateToken, getComment);

module.exports = router;
