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

router.patch("/updateStatus/:id", updateStatus);
router.get("/logoutUser", validateToken, logoutUser);
router.put("/updateUser/:id", validateToken, updateUser);
router.delete("/deleteUser/:id", validateToken, deleteUser);
router.get("/all-users", validateToken, getAllUsers);
router.get("/all-student", validateToken, getAllStudents);
router.get("/:id", validateToken, getUser);

module.exports = router;
