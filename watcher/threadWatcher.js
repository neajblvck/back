const { Thread, Comment } = require('../models/forum');

module.exports = function(io) {
  // Surveillance des changements de Thread
  const threadChangeStream = Thread.watch();
  threadChangeStream.on('change', (change) => {
    io.emit('threadChange', change); // Émet un événement à tous les clients lorsque le thread est modifié
  });

  // Surveillance des changements de Commentaire
  const commentChangeStream = Comment.watch();
  commentChangeStream.on('change', (change) => {
    io.emit('commentChange', change); // Émet un événement à tous les clients lorsque le commentaire est modifié
  });
};
