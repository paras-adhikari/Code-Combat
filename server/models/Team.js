const mongoose = require('mongoose');

// Define the Team schema
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,  // Ensure each team name is unique
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1,
    max: 4,  // A team can have a maximum of 4 members
  },
  passkey:{
    type:String,
    required:true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to User model (User can be a separate model)
    }
  ],
  contestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contest', 
    required: true // Make sure every team is associated with a contest
  },
  
  score: { 
    type: Number,
    default: 0 
  } // Default score value
}, { timestamps: true });

// Ensure that a team can have no more than 4 members
teamSchema.pre('save', function(next) {
  if (this.members.length > 4) {
    const error = new Error('A team can have a maximum of 4 members');
    next(error);
  } else {
    next();
  }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
