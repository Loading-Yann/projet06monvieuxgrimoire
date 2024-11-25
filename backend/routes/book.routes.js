const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller'); // Vérifie ce chemin
const auth = require('../middlewares/auth.middleware'); // Vérifie ce chemin
const multer = require('../middlewares/multer-config');




// Route pour récupérer tous les livres (accessible à tous)
router.get('/', bookController.getBooks);

// Route pour ajouter un livre (auth requise)
router.post('/', auth, multer, bookController.addBook);

// Route pour modifier un livre (auth requise)
router.put('/:id', auth, multer, bookController.updateBook);

// Route pour supprimer un livre (auth requise)
router.delete('/:id', auth, multer, bookController.deleteBook);

router.get('/:id', bookController.getBookById);


// Route pour récupérer les meilleurs livres
router.get('/bestrating', bookController.getBestRatedBooks);

module.exports = router;
