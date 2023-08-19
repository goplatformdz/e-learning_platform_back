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

router.use(validateToken)
router.post("/addComment", validateToken, isStudent, createComment);
router.put("/updateComment/:id", validateToken, isStudent, updateComment);
router.delete("/deleteComment/:id", validateToken, deleteComment);
router.get("/all-comments", getAllComments);
router.get("/:id", getComment);

module.exports = router;
