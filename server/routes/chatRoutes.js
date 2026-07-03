const express = require('express');
const router = express.Router();
const { askBot } = require('../controllers/chatController');

router.post('/ask', askBot);

module.exports = router;
