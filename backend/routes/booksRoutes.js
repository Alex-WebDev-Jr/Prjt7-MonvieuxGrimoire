const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('../middlewares/multer-config');// toujours après auth.. pour éviter d'enregistrer des requêtes non authentifiées.
// const sharpConfig = require('../middlewares/sharp-config');


const getAllBooks = require('../controllers/books/getAllBooks');
const getBestBooks = require('../controllers/books/getBestBooks');
const getOneBooks = require('../controllers/books/getOneBooks');
const rateBooks = require('../controllers/books/rateBooks');
const postBooks = require('../controllers/books/postBooks');
const modifyBooks = require('../controllers/books/modifyBooks');
const deleteBooks = require('../controllers/books/deleteBooks');

router.get('/', getAllBooks);
router.get('/bestrating', getBestBooks);
router.get('/:id', getOneBooks);
router.post('/:id/rating', authMiddleware, rateBooks); // authMiddleware tjrs en premier si ça doit passer par une identification
router.post('/', authMiddleware, multer, postBooks); 
router.put('/:id', authMiddleware, multer, modifyBooks); 
router.delete('/:id', authMiddleware, deleteBooks);

module.exports = router;