const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    updateCategory,
    getCategory,
    deleteCategory,
    searchByCategoryName
} = require('../controllers/categoryCtrl');
const { validateToken, isAdmin } = require('../middlewares/validateToken');


router.post("/addCategory", validateToken, isAdmin, createCategory);
router.put("/updateCategory/:id", validateToken, isAdmin, updateCategory);
router.delete("/deleteCategory/:id", validateToken, isAdmin, deleteCategory);
router.get("/all-categories", validateToken, getAllCategories);
router.get('/search_category', validateToken, searchByCategoryName);
router.get("/:id", validateToken, isAdmin, getCategory);

module.exports = router;
