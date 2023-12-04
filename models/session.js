const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // expire après 24 heures
});

module.exports = mongoose.model('Session', sessionSchema);