const express = require('express');
const router = express.Router();
const {
    registerStudent,
    loginStudent,
    getAllStudents,
    getStudent,
    deleteStudent,
    updateStudent,
} = require('../controllers/studentCtrl')

router.post("/registerStudent", registerStudent);
router.post("/loginStudent", loginStudent);
router.put("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);
router.get("/all-students", getAllStudents);
router.get("/:id", getStudent);

module.exports = router;
