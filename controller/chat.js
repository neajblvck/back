// FULL CHAT CONTROLLER

const { Thread, Comment } = require('../models/forum');
const userModel = require('../models/user');
const mongoose = require('mongoose');




// THREAD 

exports.createThread = async (req, res) => {
  try {
    const { title, content, expirationDate, commentContent } = req.body;
    const authorId = req.auth.userId;

    if (expirationDate && isNaN(new Date(expirationDate))) {
      return res.status(400).json({ message: "Date d'expiration invalide." });
    }

    if (expirationDate && new Date(expirationDate) < new Date()) {
      return res.status(400).json({ message: "La date d'expiration doit être dans le futur." });
    }

    if (!commentContent || commentContent.trim() === '') {
      return res.status(400).json({ message: "Un commentaire doit être inclus." });
    }

    const thread = new Thread({
      title,
      content,
      expirationDate,
      author: authorId
    });

    const savedThread = await thread.save();

    const comment = new Comment({
      author: authorId,
      content: commentContent,
      date: savedThread.createdAt,
      thread: savedThread._id
    });

    const savedComment = await comment.save();
    savedThread.comments.push(savedComment._id);
    await savedThread.save();

    res.status(201).json({ message: 'Thread et commentaire initial postés' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// exports.createThread = (req, res) => {
//   console.log(req.body);
//   const { expirationDate, commentContent } = req.body;
//   const authorId = req.auth.userId;

//   if (expirationDate && new Date(expirationDate) < new Date()) {
//     return res.status(400).json({ message: "La date d'expiration doit être dans le futur." });
//   }

//   if (expirationDate && isNaN(new Date(expirationDate))) {
//     return res.status(400).json({ message: "Date d'expiration invalide." });
//   }




//   const comment = new Comment({
//     content: commentContent,
//     author: authorId,
//     date: new Date()
//   });

//   comment.save()
//     .then(savedComment => {
//       const thread = new Thread({
//         ...req.body,
//         author: authorId,
//         comments: [savedComment._id]
//       });

//       return thread.save();
//     })
//     .then(savedThread => {
//       res.json(savedThread);
//     })
//     .catch(err => {
//       res.status(500).json({ error: err.message });
//     });
// };




exports.getThreadById = (req, res) => {
  const id = req.params.id;

  Thread.findById(id)
    .populate('author', 'name surname phone email') // Peuple l'auteur du thread
    .populate({ 
      path: 'comments', // Peuple les commentaires
      populate: {
        path: 'author', // Peuple l'auteur de chaque commentaire
        select: 'name surname phone email' // Sélectionne les champs spécifiques de l'auteur
      }
    })
    .then(thread => {
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
      res.status(200).json(thread);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'An error occurred' });
    });
};


exports.getAllThread = (req, res) => {
  Thread.find()
  .populate('author', 'name surname phone email')
    .populate('comments')
    .then(thread => {
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
      res.status(200).json(thread);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'An error occurred' });
    });
};


exports.updateThread = (req, res) => {
  Thread.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(thread => res.json(thread))
    .catch(err => res.status(500).send(err));
};

exports.deleteThread = (req, res) => {
  // Suppression de tous les commentaires associés à ce fil de discussion
  Comment.deleteMany({ thread: req.params.id })
    .then(() => {
      // Suppression du fil de discussion
      return Thread.findByIdAndRemove(req.params.id);
    })
    .then(() => res.json({ message: 'Feed et commentaires supprimés' }))
    .catch(err => res.status(500).send(err));
};

// COMMENT

// exports.createComment = (req, res) => {


//   const authorId = req.auth.userId;

//   const comment = new Comment({
//     content: req.body.content,
//     author: authorId,
//     thread: req.params.id,
//   });

//   comment.save()
//     .then(savedComment => {
//       return Thread.findById(req.params.id);
//     })
    
//     .then(thread => {
//       if (!thread) {
//         throw new Error('Thread not found');
//       }
//       thread.comments.push(comment._id); // Ajoute l'ID du commentaire au tableau de commentaires
//       return thread.save(); // Enregistre le fil de discussion mis à jour
//     })
//     .then(() => {
//       res.status(201).json({ message: 'commentaire posté' });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ err });
//     });
// };

exports.createComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authorId = req.auth.userId;

    const comment = new Comment({
      content: req.body.content,
      author: authorId,
      thread: req.params.id,
    });

    const savedComment = await comment.save({ session });
    const thread = await Thread.findById(req.params.id).session(session);

    if (!thread) {
      throw new Error('Thread not found');
    }

    thread.comments.push(savedComment._id); // Ajoute l'ID du commentaire au tableau de commentaires
    await thread.save({ session }); // Enregistre le fil de discussion mis à jour

    await session.commitTransaction(); // Commit la transaction

    res.status(201).json({ message: 'commentaire posté' });
  } catch (err) {
    await session.abortTransaction(); // Abort la transaction si une erreur se produit

    console.error(err);
    res.status(500).json({ err });
  } finally {
    session.endSession(); // Termine la session
  }
};



exports.getCommentById = (req, res) => {
  Comment.findById(req.params.id)
    .populate('author')
    .populate('thread')
    .then(comment => res.json(comment))
    .catch(err => res.status(500).send(err));
};

exports.updateComment = (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(comment => res.json(comment))
    .catch(err => res.status(500).send(err));
};

exports.deleteComment = (req, res) => {
  Comment.findByIdAndRemove(req.params.id)
    .then(() => res.json({ message: 'Commentaire supprimé !' }))
    .catch(err => res.status(500).send(err));
};

