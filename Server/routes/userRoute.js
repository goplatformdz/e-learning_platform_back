const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    subscribeToNewsLetter,
    forgotPassword,
    resetPassword,
    checkLogin,
    updateStatus,
    getAllStudents
} = require('../controllers/userCtrl');

const { validateToken, isAdmin, isStudent } = require('../middlewares/validateToken');

// Public Routes
router.get("/checkLogin", checkLogin);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

router.post('/subscribe-newsletter', subscribeToNewsLetter);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protected Routes (Require Authentication)
// Middleware for authentication

router.get("/logoutUser", logoutUser);
router.put("/updateUser/:id", updateUser);
router.put("/updateStatus/:id",  updateStatus);
router.delete("/deleteUser/:id", deleteUser);
router.get("/all-users",  getAllUsers);
router.get("/all-student",getAllStudents);
router.get("/:id",  getUser);

module.exports = router;
