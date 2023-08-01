const Books = require('../../models/books'); // modèle de données pour les livres biensûr!
const sharp = require('sharp'); // importe la bibli sharp pour redimensionner
const fs = require('fs'); // bibli pour suprim

const postBooks = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book); // je parse tu parses pour obtenir un objet
    
    delete bookObject._id; // supprimer l'id car il sera donné par MongoDB
    delete bookObject._userId; // supprimer l'id de créateur pour éviter l'utilisation frauduleuse d'un nom d'utilisateur.

    const imagePath = req.file.path; // récup le chemin de l'image

    // Redimensionne l'image à 463x595
    sharp(imagePath)
      .resize(463, 595)
      .toBuffer()
      .then(buffer => {
        // Remplace l'image originale par l'image redimensionnée
        fs.writeFile(imagePath, buffer, err => {
          if (err) {
            fs.unlinkSync(imagePath); // Supprimer le fichier original en cas d'erreur lors du redimensionnement
            return res.status(400).json({ error: 'Une erreur s\'est produite lors du redimensionnement de l\'image.' });
          }

          // Crée une instance de modèle de livre avec les données mises à jour
          const book = new Books({
            ...bookObject,
            userId: req.authMiddleware.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Générer l'URL de l'image mise à jour
          });

          // Enregistre le livre dans la base de données MongoDB
          book.save()
            .then(() => {
              res.status(201).json({ message: 'Livre enregistré !' });
            })
            .catch(error => {
              res.status(400).json({ error });
            });
        });
      })
      .catch(error => {
        res.status(400).json({ error: 'Une erreur s\'est produite lors du redimensionnement de l\'image.' });
      });
  } catch (error) { // erreur au moment de la requête.
    res.status(400).json({ error });
  }
};

module.exports = postBooks;
