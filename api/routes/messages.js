const express = require("express");
const { addMessage, getMessages } = require("../controllers/message.js");

const router = express.Router();

router.post('/', addMessage);
router.get('/:conversationId', getMessages);

module.exports = router;