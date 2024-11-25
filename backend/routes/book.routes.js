const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller'); // Chemin vers le contrôleur des livres
const auth = require('../middlewares/auth.middleware'); // Middleware d'authentification
const multer = require('../middlewares/multer-config'); // Middleware pour le traitement des fichiers

// Route pour récupérer tous les livres (accessible à tous)
router.get('/', bookController.getBooks);

// Route pour ajouter un livre (auth requise)
router.post('/', auth, multer, bookController.addBook);

// Route pour modifier un livre (auth requise)
router.put('/:id', auth, multer, bookController.updateBook);

// Route pour supprimer un livre (auth requise)
router.delete('/:id', auth, bookController.deleteBook);

// Route pour récupérer un livre par son ID (accessible à tous)
router.get('/:id', bookController.getBookById);

// Route pour récupérer les meilleurs livres (accessible à tous)
router.get('/best-rated', bookController.getBestRatedBooks);

// Route pour noter un livre (auth requise)
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
