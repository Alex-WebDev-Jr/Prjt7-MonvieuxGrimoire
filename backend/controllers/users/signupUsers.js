const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // penser à npm install --save jsonwebtoken pour creer et vérifier les tokens d'authentification
const User = require('../../models/user');



// Inscription ////////////////////////////////

  exports.signup = (req, res, next) => {
    const { email, password } = req.body;
  
    // Vérification des champs requis (email et mot de passe)
    if (!email || !password) {
      return res.status(400).json({ error: 'email et mot de passe requis' });
    }
  
    // Vérification si l'email existe déjà
    User.findOne({ email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(409).json({ error: 'L\'email est déjà utilisé par un autre utilisateur' });
        }
  
        // Hashage du mot de passe
        bcrypt.hash(password, 10) // "saler le mot de passe 10 fois", fonction asynchrone
          .then(hash => {
            const user = new User({ // création d'un new utilisateur: email + mdp haché
              email,
              password: hash
            });
  
            // Enregistrement du nouvel utilisateur dans la base de données
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès' }))
              .catch(error => res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur' }));
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };