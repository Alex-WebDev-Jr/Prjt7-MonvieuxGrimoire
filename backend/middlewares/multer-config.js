const multer = require('multer')

// Définition des types MIME autorisés et de leurs extensions correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
  // Destination du fichier
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  // Nom du fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
  }
});



module.exports = multer({ storage }).single('image');