const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Books = require('../../models/books');

// Mettre à jour un livre par ID
const modifyBooks = (req, res, next) => {
  const booksId = req.params.id;
  const updatedBooks = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  // Récupérer le userId depuis le token d'authentification
  const userId = req.authMiddleware.userId;

  // Supprimer le champ _userId envoyé par le client (s'il existe)
  delete updatedBooks._userId;

  // Vérifier si l'utilisateur est authentifié
  if (!userId) {
    return res.status(403).json({ error: 'Accès non autorisé. Vous devez être connecté pour effectuer cette action.' });
  }

  // Vérifier que le livre appartient à l'utilisateur (vérification du bon userId)
  Books.findOne({ _id: booksId, userId: userId })
    .then((book) => {
      if (!book) {
        return res.status(403).json({ error: 'Requête non autorisée. Vous n\'êtes pas le propriétaire de ce livre.' });
      }

      // Si une nouvelle photo est chargée, supprimer l'ancienne photo du dossier "images"
      if (req.file) {
        const imagePath = path.join(__dirname, '../../images/', book.imageUrl.split('/').pop());
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de l\'ancienne image :', err);
          }
        });

        // Redimensionner la nouvelle image avant de l'enregistrer
        sharp(req.file.path)
          .resize(463, 595)
          .toBuffer()
          .then(buffer => {
            // Remplace l'image originale par l'image redimensionnée
            fs.writeFile(req.file.path, buffer, (err) => {
              if (err) {
                console.error('Erreur lors du remplacement de l\'image par l\'image redimensionnée :', err);
                return res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image.' });
              }

              // Mettre à jour le livre dans la base de données avec la nouvelle photo redimensionnée
              Books.findOneAndUpdate({ _id: booksId, userId: userId }, updatedBooks, { new: true })
                .then(updatedBook => {
                  res.status(200).json({ message: 'Livre mis à jour.', book: updatedBook });
                })
                .catch(error => {
                  res.status(400).json({ error: error.message });
                });
            });
          })
          .catch(error => {
            console.error('Erreur lors du redimensionnement de l\'image :', error);
            res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image.' });
          });
      } else {
        // Si aucune nouvelle photo n'est chargée, mettre à jour le livre sans redimensionnement
        Books.findOneAndUpdate({ _id: booksId, userId: userId }, updatedBooks, { new: true })
          .then(updatedBook => {
            res.status(200).json({ message: 'Livre mis à jour.', book: updatedBook });
          })
          .catch(error => {
            res.status(400).json({ error: error.message });
          });
      }
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
};

module.exports = modifyBooks;
