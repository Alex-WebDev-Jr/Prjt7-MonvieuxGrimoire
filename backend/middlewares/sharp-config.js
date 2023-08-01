const sharp = require('sharp');

const sharpConfig = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    await sharp(req.file.path)
      .resize(463, 595)
      

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
};

module.exports = sharpConfig;
