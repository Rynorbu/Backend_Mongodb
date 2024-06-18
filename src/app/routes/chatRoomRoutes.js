// chatRoomRoutes.js
const express = require('express');
const { getOrCreateChatRoom, addMessage, getMessages } = require('../controllers/chatRoomController');

const router = express.Router();

router.get('/:member1/:member2', getOrCreateChatRoom);
router.post('/:room_id/messages', addMessage);
router.get('/:room_id/messages', getMessages);

module.exports = router;
