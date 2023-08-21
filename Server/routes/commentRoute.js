const express = require('express');
const router = express.Router();
const {
    createComment,
    getAllComments,
    updateComment,
    getComment,
    deleteComment,
} = require('../controllers/commentCtrl');
const { validateToken, isStudent } = require('../middlewares/validateToken');


router.post("/addComment", validateToken, isStudent, createComment);
router.put("/updateComment/:id", validateToken, isStudent, updateComment);
router.delete("/deleteComment/:id", validateToken, deleteComment);
router.get("/all-comments", validateToken, getAllComments);
router.get("/:id", validateToken, getComment);

module.exports = router;
