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


router.post("/addCategory",  createCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id",  deleteCategory);
router.get("/all-categories", getAllCategories);

router.get('/search_category', searchByCategoryName);
router.get("/:id", validateToken, isAdmin, getCategory);


module.exports = router;
