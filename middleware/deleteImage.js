const fs = require('fs');

const deleteImageMiddleware = (model, imageField) => {
    return (req, res, next) => {
        model.findOne({ _id: req.params.id })
            .then(document => {
                const imageUrl = document[imageField];
               
                if (imageUrl) {
                    const filename = imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            console.error("Erreur lors de la suppression de l'image:", err);
                            return res.status(500).json({ message: "Erreur lors de la suppression de l'image" });
                        }
                        next();
                    });
                } else {
                    next();
                }
            })
            .catch(error => {
                console.error("Erreur lors de la recherche du document:", error);
                res.status(500).json({ message: "Erreur lors de la recherche du document" });
            });
    };
};

module.exports = deleteImageMiddleware;
