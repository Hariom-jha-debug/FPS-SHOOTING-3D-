const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  stats: {
    totalKills: { type: Number, default: 0 },
    totalShots: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
