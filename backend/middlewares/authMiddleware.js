const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {

    // Récupére le token depuis l'en-tête de la requête
    const token = req.headers.authorization.split(' ')[1]; // split = diviser la chaine de caracteres en un tableau autour de l'espace entre bearer et token
    
    // décoder le token pour vérifier si le token est valide
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token

    // récuper le user id en particulier
    const userId = decodedToken.userId;

    req.authMiddleware = { // objet authMiddleware
        userId: userId     // chanp iserId
    };
    next(); // si tout est bon on passe à l'exécution via la fonction next();

  } catch (error) {
    res.status(401).json({ message: 'zut Authentification échouée.' });
  }
};

