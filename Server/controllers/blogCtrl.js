const Blog = require('../models/blogModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const moment = require('moment');

const createBlog = asyncHandler(async (req, res, next) => {
    try {
        const newBlog = await Blog.create(req.body);

        // Format the createdAt field to "DD/MM/YYYY" format
        const formattedCreatedAt = moment(newBlog.createdAt).format('DD/MM/YYYY');

        // Include the formatted date in the response
        const responseData = {
            ...newBlog.toObject(),
            createdAt: formattedCreatedAt,
        };

        res.status(200).json({ message: 'Blog post successfully added', data: responseData });
    } catch (error) {
        return next(new CustomError('Error while creating a blog post', 500));
    }
});

const updateBlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByIdAndUpdate(
            id,
            {
                title: req?.body?.title,
                content: req?.body?.content,
                author: req?.body?.author,
                image: req?.body?.image,
            },
            { new: true }
        );

        if (!blog) {
            return next(new CustomError(`Couldn't find the blog post with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Blog post updated successfully', data: blog });
    } catch (error) {
        return next(new CustomError('Error while updating a blog post', 500));
    }
});

const getAllBlogs = asyncHandler(async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json(blogs);
    } catch (error) {
        return next(new CustomError('Error while fetching blog posts', 500));
    }
});

const getBlog = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return next(new CustomError(`Couldn't find the blog post with the id of ${id}`, 404));
        }

        res.status(200).json(blog);
    } catch (error) {
        return next(new CustomError('Error while fetching a blog post', 500));
    }
});

const deleteBlog = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return next(new CustomError(`Couldn't find the blog post with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        return next(new CustomError('Error while deleting a blog post', 500));
    }
});

module.exports = {
    createBlog,
    getAllBlogs,
    updateBlog,
    getBlog,
    deleteBlog,
};
