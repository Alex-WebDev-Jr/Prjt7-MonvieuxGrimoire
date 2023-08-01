const Books = require('../../models/books');

// Obtenir tous les livres
const getAllBooks = (req, res, next) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: error }));
};

module.exports = getAllBooks;
