const Books = require('../../models/books');

// Obtenir un livre par ID
const getOneBooks = (req, res, next) => {
  const booksId = req.params.id;
  Books.findById(booksId)
    .then(books => {
      if (!books) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }
      res.status(200).json(books);
    })
    .catch(error => res.status(400).json({ error: error }));
};

module.exports = getOneBooks;
