const express = require('express');
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    updateBlog,
    getBlog,
    deleteBlog,
} = require('../controllers/blogCtrl');
const { validateToken, isAdmin } = require('../middlewares/validateToken');

router.post("/addBlog",  createBlog);
router.put("/updateBlog/:id",updateBlog);
router.delete("/deleteBlog/:id",  deleteBlog);
router.get("/all-blogs", getAllBlogs);
router.get("/:id", getBlog);

module.exports = router;
