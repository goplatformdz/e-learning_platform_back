const express = require('express');
const router = express.Router();
const {
    createStudent,
    loginStudent,
    getAllStudents,
    getStudent,
    deleteStudent,
    updateStudent,
} = require('./controllers/studentCtrl')

router.post("/registerStudent", createStudent);
router.post("/loginStudent", loginStudent);
router.put("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);
router.get("/all-students", getAllStudents);
router.get("/:id", getStudent);

module.exports = router;
