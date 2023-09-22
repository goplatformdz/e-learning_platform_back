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
    forgotPassword,
    resetPassword,
    getCurrentUser,
    logoutUser
} = require('../controllers/userCtrl')
const { validateToken, isAdmin, isStudent } = require('../middlewares/validateToken');

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.get("/logoutUser", validateToken, logoutUser);
router.put("/updateUser/:id", validateToken, updateUser);
router.delete("/deleteUser/:id", validateToken, deleteUser);
router.get("/all-users", validateToken, isAdmin, getAllUsers);
router.get("/getCurrentUser", validateToken, getCurrentUser);
router.get("/:id", validateToken, isAdmin, getUser);
router.post('/subscribe-newsletter', subscribeToNewsLetter);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);


module.exports = router;
