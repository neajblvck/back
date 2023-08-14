const mongoose = require('mongoose');

// Modèle Fil de discussion
const threadSchema = new mongoose.Schema({
    title: {type: String, required : true},
    content: {type: String, required : true},
    expirationDate: { type: Date, index: { expires: '1s' } }, // Index TTL
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required : true},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },]
  }, {
    timestamps: true // Active les timestamps
  });
  const Thread = mongoose.model('Thread', threadSchema);
  
  // Modèle Commentaire
  const commentSchema = new mongoose.Schema({
    content: {type: String, required : true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required : true },
    date: {type: Date},
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required : true}
  });
  const Comment = mongoose.model('Comment', commentSchema);
  
  module.exports = {
    Thread,
    Comment
  };