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
router.get("/all-categories", getAllCategories);
router.get('/search_category', searchByCategoryName);
router.get("/:id", validateToken, isAdmin, getCategory);


router.delete("/deleteCategory/:id", validateToken, deleteCategory);
router.post("/addCategory", validateToken, createCategory);
router.put("/updateCategory/:id", validateToken, updateCategory);



module.exports = router;
