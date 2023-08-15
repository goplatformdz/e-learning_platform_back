const express = require('express');
const router = express.Router();
const {
    createComment,
    getAllComments,
    updateComment,
    getComment,
    deleteComment,
} = require('./controllers/commentCtrl');

router.post("/addComment", createComment);
router.put("/updateComment/:id", updateComment);
router.delete("/deleteComment/:id", deleteComment);
router.get("/all-comments", getAllComments);
router.get("/:id", getComment);

module.exports = router;
