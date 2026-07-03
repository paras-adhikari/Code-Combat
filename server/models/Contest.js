const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  startTime: { 
    type: Date, 
    // required: true 
  },
  endTime: { 
    type: Date, 
    // required: true 
  },
  status: { 
    type: String, 
  },
  winningTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' // This is a reference to a single team who won
  },
  teams: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team'  // Array of team references that are part of the contest
  }]
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
