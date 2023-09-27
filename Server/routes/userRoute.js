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

    logoutUser,
    checkLogin,
    updateStatus
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
router.use(validateToken); // Middleware for authentication

router.get("/logoutUser", logoutUser);
router.put("/updateUser/:id", updateUser);
router.put("/updateStatus/:id", isAdmin, updateStatus);
router.delete("/deleteUser/:id", deleteUser);
router.get("/all-users", isAdmin, getAllUsers);
router.get("/:id", isAdmin, getUser);

module.exports = router;
