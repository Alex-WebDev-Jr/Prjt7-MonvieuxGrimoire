const express = require('express'); // penser à npm install express
const mongoose = require('mongoose'); // importer mangoose
const config = require('./config'); // pour la connexion sécurisé de mongo
const dotenv = require('dotenv').config() // connexion sécurisé token
const cors = require('cors'); // Importe le module cors
const path = require('path'); // importe module Node.js pour les chemins de fichiers

const app = express(); // créer une application Express, appelez simplement la méthode  express()

const authMiddleware = require('./middlewares/authMiddleware');

// importer les models ////////
const User = require('./models/user'); // permet de definir le modele user
const Books = require('./models/books'); // permet de definir le modele user

// importer les routes /////
const usersRoutes = require('./routes/usersRoutes'); // permet de definir la route users
const booksRoutes = require('./routes/booksRoutes');

// connecter MongoDB //////////////////
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Headers pour accéder à l'API depuis n'importe quelle origine // empêche les erreurs CORS & permet des equêtes cross-origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware //////////////////////////
app.use(cors()); //  Middleware pour communiquer sur des domaines différents

app.use(express.json()); // Middleware pour analyser les requêtes JSON permet de gérer les requêtes POST (middle donné par le framework Express)


// Les routes ///////////////////////////

//route static pour les images
app.use('/images', express.static(path.join(__dirname, 'images'))); // ajouter en haut du fichier : const path = require('path'); express.static middlew donné par express

// Utilisation des routes des utilisateurs
app.use('/api/auth', usersRoutes);

// Utilisation des routes des livres
app.use('/api/books', booksRoutes);


// Middleware d'authentification global pour toutes les autres routes
app.use(authMiddleware);

module.exports = app;
