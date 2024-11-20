const express = require('express');
const { getBooks, addBook, getBookById, deleteBook } = require('../controllers/book.controller');

const router = express.Router();

// Route pour récupérer tous les livres
router.get('/', getBooks);

// Route pour ajouter un nouveau livre
router.post('/', addBook);

// Route pour récupérer un livre par son ID
router.get('/:id', getBookById);

// Route pour supprimer un livre par son ID
router.delete('/:id', deleteBook);

module.exports = router;
