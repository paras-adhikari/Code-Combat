const mongoose = require('mongoose');

const CodeStatementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  statement: { type: String, required: true },
  description: { type: String, required: true },
  testcases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ]
});

const CodeStatement = mongoose.model('CodeStatement', CodeStatementSchema);

module.exports = CodeStatement;
