const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  github:{type: String},
  linkedin:{type: String},
  statistics: {
    contestsParticipated: { type: Number, default: 0 },
    contestsWon: { type: Number, default: 0 },
    contestsLost: { type: Number, default: 0 },
    rank:{type:Number, default: 0},
    rating:{type:Number, default: 0}
  },

});

const User = mongoose.model('User', userSchema);
module.exports = User;
