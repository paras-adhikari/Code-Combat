const express = require('express');
const router = express.Router();
const codeStatementsController = require('../controllers/codeStatementsController');

// Route to fetch all problems
router.get('/problems', codeStatementsController.getAllProblems);

// Route to fetch a specific problem by ID
router.get('/problem/:id', codeStatementsController.getProblemById);

module.exports = router;
