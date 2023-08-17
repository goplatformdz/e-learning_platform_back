const express = require('express');
const router = express.Router();
const {
    registerStudent,
    loginStudent,
    getAllStudents,
    getStudent,
    deleteStudent,
    updateStudent,
    subscribeToNewsLetter
} = require('../controllers/studentCtrl')
const { validateToken } = require('../middleWares/validateToken');

router.post("/registerStudent", registerStudent);
router.post("/loginStudent", loginStudent);
router.put("/updateStudent/:id", validateToken, updateStudent);
router.delete("/deleteStudent/:id", validateToken, deleteStudent);
router.get("/all-students", validateToken, getAllStudents);
router.get("/:id", validateToken, getStudent);
router.post('/subscribe-newsletter', validateToken, subscribeToNewsLetter)

module.exports = router;
