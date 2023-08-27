const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    subscribeToNewsLetter,
    getRecommendedCourses,
} = require('../controllers/userCtrl')
const { validateToken, isAdmin, isStudent } = require('../middlewares/validateToken');

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.put("/updateUser/:id", validateToken, updateUser);
router.delete("/deleteUser/:id", validateToken, deleteUser);
router.get("/all-users", validateToken, getAllUsers);
router.get("/:id", validateToken, getUser);
router.post('/subscribe-newsletter', validateToken, subscribeToNewsLetter);
router.get('/recommended-courses',validateToken, getRecommendedCourses);


module.exports = router;
