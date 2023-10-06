const Category = require('../models/categoryModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createCategory = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;
        const { image } = req.files;

        function uploadImage(imageData) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {},
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                            // You can access the public URL of the uploaded image using result.url
                        }
                    }
                ).end(imageData.data);
            });
        }

        const R = await uploadImage(image);
        const imageUrl = R.url;

        const newCategory = await Category.create({
            name,
            image: imageUrl,

        });

        console.log(name);
        console.log(image)
        res.status(200).json({ message: 'Category successfully added', data: { newCategory } });
    } catch (error) {
        return next(new CustomError('Error while creating category', 500));
    }
});


const updateCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const { image } = req.files ? req.files : '';

        const categoryToUpdate = await Category.findById(id);

        if (!categoryToUpdate) {
            return next(new CustomError(`Category with ID ${id} not found`, 404));
        }

        // Define a function to upload a new image to Cloudinary
        function uploadImage(imageData) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {},
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                            // You can access the public URL of the uploaded image using result.url
                        }
                    }
                ).end(imageData.data);
            });
        }

        let imageUrl = ''
        if (image) {

            const R = await uploadImage(image);
            imageUrl = R.url;
        }
        const foundedCategory = await Category.findById(id)

        const newCategory = await Category.findByIdAndUpdate(
            id,
            {
                name,
                image: imageUrl ? imageUrl : foundedCategory.image,
            },
            { new: true }


        );


        res.status(200).json({ message: 'Category successfully updated', data: newCategory });
    } catch (error) {
        return next(new CustomError('Error while updating category', 500));
    }
});


const getAllCategories = asyncHandler(async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        return next(new CustomError('Error while fetching categories', 500));
    }
});

const getCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return next(new CustomError(`Couldn't find category with the id of ${id}`, 404));
        }

        res.status(200).json(category);
    } catch (error) {
        return next(new CustomError('Error while fetching category', 500));
    }
});

const searchByCategoryName = asyncHandler(async (req, res, next) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return next(new CustomError('Category name is required.', 500));
        }

        const regex = new RegExp(categoryName, 'i'); // 'i' flag for case-insensitive search

        const result = await Category.find({ name: regex });

        res.status(200).json({ success: true, result });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return next(new CustomError(`Couldn't find category with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return next(new CustomError('Error while deleting category', 500));
    }
});

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    getCategory,
    deleteCategory,
    searchByCategoryName
};
