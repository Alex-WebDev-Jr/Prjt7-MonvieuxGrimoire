const Book = require('../../models/books');

// Définition de la fonction rateBook
async function rateBook(req, res) {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    // Vérification si l'utilisateur est autorisé à voter
    const userId = req.body.userId;
    if (book.ratings.some((obj) => obj.userId === userId)) {
      return res.status(403).json({ error: 'Vous ne pouvez pas voter pour ce livre.' });
    }

    // Création de l'objet de nouvelle note
    const newRatingObject = {
      userId: userId,
      grade: req.body.rating,
    };

    // Ajout de la nouvelle note dans le tableau ratings
    book.ratings.push(newRatingObject);

    // Calcul de la nouvelle moyenne
    const allRatings = book.ratings.map((rating) => rating.grade);
    const sum = allRatings.reduce((total, curr) => total + curr, 0);
    const averageRating = sum / allRatings.length;
    book.averageRating = averageRating.toFixed(1);

    // Mise à jour du livre avec les nouveaux champs de note et de note moyenne
    await book.save();

    // Réponse avec le livre mis à jour
    res.status(200).json(book);
  } catch (error) {
    
    res.status(500).json({ error: 'Une erreur est survenue lors du vote pour ce livre.' });
  }
};
module.exports = rateBook;