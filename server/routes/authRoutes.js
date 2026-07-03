const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);  // Sign up a new user
router.post('/login', login);  // Login user

module.exports = router;
