const Books = require('../../models/books');

// Obtenir les 3 meilleurs livres
const getBestBooks = (req, res, next) => {
  Books.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(404).json({ error: error });
    });
};

module.exports = getBestBooks;
