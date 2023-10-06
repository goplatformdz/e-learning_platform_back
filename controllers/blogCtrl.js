const Blog = require('../models/blogModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const moment = require('moment');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const createBlog = asyncHandler(async (req, res, next) => {
    try {
        const { title, content, author } = req.body;
        const { image1, image2 } = req.files;

        // Define a function to upload an image to Cloudinary
        function uploadImage(imageData) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {},
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }

                ).end(imageData.data);

            });
        }

        // Upload the first image and get its URL
        const R1 = await uploadImage(image1);
        const url1 = R1.url;


        // Upload the second image and get its URL
        const R2 = await uploadImage(image2);
        const url2 = R2.url;



        const newBlog = await Blog.create({
            title,
            content,
            author,
            photo1: url1,
            photo2: url2,

        });

        // Format the createdAt field to "DD/MM/YYYY" format
        const formattedCreatedAt = moment(newBlog.createdAt).format('DD/MM/YYYY');

        // Include the formatted date in the response
        const responseData = {
            ...newBlog.toObject(),
            createdAt: formattedCreatedAt,
        };

        res.status(200).json({ message: 'Blog post successfully added', data: responseData });
    } catch (error) {

        next(new CustomError('Error while creating a blog post', 500));
    }
});

const updateBlog = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ID of the blog post to update
        const { title, content, author } = req.body;
        const { image1, image2 } = req.files ? req.files : '';

        // Define a function to upload an image to Cloudinary
        function uploadImage(imageData) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {},
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(imageData.data);
            });
        }

        let url1 = ""
        let url2 = ""
        if (image1) {
            // Upload the first image and get its URL
            const R1 = await uploadImage(image1);
            url1 = R1.url;
        }

        if (image2) {
            // Upload the second image and get its URL
            const R2 = await uploadImage(image2);
            url2 = R2.url;
        }

        const foundBlog = await Blog.findById(id)

        // Find the blog post by ID and update its fields
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                content,
                author,
                photo1: url1 ? url1 : foundBlog.photo1,
                photo2: url2 ? url2 : foundBlog.photo2,
            },
            { new: true } // Return the updated blog post
        );

        if (!updatedBlog) {
            return next(new CustomError(`Blog post with ID ${id} not found`, 404));
        }

        // Format the updatedAt field to "DD/MM/YYYY" format
        const formattedUpdatedAt = moment(updatedBlog.updatedAt).format('DD/MM/YYYY');

        // Include the formatted date in the response
        const responseData = {
            ...updatedBlog.toObject(),
            updatedAt: formattedUpdatedAt,
        };

        res.status(200).json({ message: 'Blog post successfully updated', data: responseData });
    } catch (error) {
        next(new CustomError(error.message, 500));
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
