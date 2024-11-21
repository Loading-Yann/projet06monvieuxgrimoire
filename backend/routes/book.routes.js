const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// Route pour récupérer tous les livres
router.get('/', bookController.getBooks);

// Route pour ajouter un livre
router.post('/', bookController.addBook);

// Route pour modifier un livre
router.put('/:id', bookController.updateBook);

// Route pour supprimer un livre
router.delete('/:id', bookController.deleteBook);

// Route pour récupérer les meilleurs livres
router.get('/bestrating', bookController.getBestRatedBooks);

module.exports = router;
