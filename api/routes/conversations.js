const express = require("express");
const { createChat, userChats, findChat } = require("../controllers/conversation.js");

const router = express.Router();

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/find/:firstUserId/:secondUserId', findChat);


module.exports = router;