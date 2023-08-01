const Books = require('../../models/books');
const fs = require('fs');
const path = require('path');

const deleteBooks = (req, res, next) => {
  const bookId = req.params.id;
  const userIdFromToken = req.authMiddleware.userId; 

  Books.findOne({ _id: bookId })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      if (book.userId !== userIdFromToken) {
        return res.status(401).json({ message: 'Non-autorisé' });
      } else {
        // Vérifie si le livre a une image associée
        if (book.imageUrl) {
          const imageName = book.imageUrl.split('/').pop();

        // Supprime l'image du dossier "images"
        try {
          fs.unlinkSync(path.join(__dirname, '..', '..', 'images', imageName));
        } catch (error) {
          console.error('Erreur lors de la suppression du fichier', error);
        }
        }
        // Supprime le livre de la base de données
        Books.deleteOne({ _id: bookId })
          .then(() => {
            res.status(200).json({ message: 'Livre supprimé !' });
          })
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => {
      next(error);
    });
};

module.exports = deleteBooks;
