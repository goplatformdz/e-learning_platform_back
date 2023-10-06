const express = require('express');
const router = express.Router();
const {
    createChatRoom,
    getChatrooms,
    findChatroom,
} = require('../controllers/chatroomCtrl');
const { validateToken } = require('../middlewares/validateToken');


router.post("/createChatroom", validateToken, createChatRoom);
router.get("/all-chatrooms", validateToken, getChatrooms);
router.get("/findChatroom/:first_id/:second_id", validateToken, findChatroom);


module.exports = router;
