const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // penser à npm install --save jsonwebtoken pour creer et vérifier les tokens d'authentification
const User = require('../../models/user');

// Connexion ////////////////////////////////
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
          }

          // Réponse avec l'identifiant de l'utilisateur et le token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET, // Utilisation de la clé secrète définie ds le fichier .env
              { expiresIn: '24h' } // valide max 24h 
            )
          });
        })
        .catch(error => res.status(500).json({ error })); // 500 = erreur de traitement
    })
    .catch(error => res.status(500).json({ error }));
};