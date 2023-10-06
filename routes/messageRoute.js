const express = require('express');
const router = express.Router();
const {
    getMessages,
    addMessage
} = require('../controllers/messageCtrl');
const { validateToken } = require('../middlewares/validateToken');


router.post("/addMessage", validateToken, addMessage);
router.get("/all-messages/:chatroom_id", validateToken, getMessages);


module.exports = router;
