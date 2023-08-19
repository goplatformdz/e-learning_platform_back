const Category = require('../models/categoryModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res, next) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(200).json({ message: 'Category successfully added', data: newCategory });
    } catch (error) {
        return next(new CustomError('Error while creating category', 500));
    }
});

const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { name: req?.body?.name },
            { new: true }
        );

        if (!category) {
            return next(new CustomError(`Couldn't find category with the id of ${id}`, 404));
        }

        res.status(200).json({ message: 'Updated Successfully', data: category });
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
