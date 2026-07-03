const CodeStatement = require('../models/CodeStatement');

// Fetch all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await CodeStatement.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

// Fetch a specific problem by its ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await CodeStatement.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
};
