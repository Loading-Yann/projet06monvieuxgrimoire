const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller'); // Contrôleurs
const auth = require('../middlewares/auth.middleware'); // Middleware d'authentification
const multer = require('../middlewares/multer-config'); // Middleware pour les fichiers
const validateId = require('../middlewares/validateId.middleware'); // Middleware de validation d'ID

// Route pour récupérer les 3 meilleurs livres (accessible à tous)
router.get('/best-rated', bookController.getBestRatedBooks);

// Route pour récupérer tous les livres (accessible à tous)
router.get('/', bookController.getBooks);

// Route pour récupérer un livre par ID (accessible à tous)
router.get('/:id', validateId, bookController.getBookById);

// Route pour ajouter un livre (authentification requise)
router.post('/', auth, multer, bookController.addBook); 

// Route pour modifier un livre (authentification requise)
router.put('/:id', auth, validateId, multer, bookController.updateBook);

// Route pour supprimer un livre (authentification requise)
router.delete('/:id', auth, validateId, bookController.deleteBook);

// Route pour noter un livre (authentification requise)
router.post('/:id/rating', auth, validateId, bookController.rateBook);

module.exports = router;
