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

// New route for subscribing to the newsletter and sending confirmation email
router.post('/subscribe-newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        await sendNewsletterConfirmationEmail(email);

        // Respond to the client
        res.status(200).json({ message: 'Newsletter subscription confirmed' });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'An error occurredd' });
    }
});

module.exports = router;
