const Book = require('../models/book.model');
const fs = require('fs');
const logger = require('../utils/logger');
const path = require('path');

// Récupérer tous les livres
exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    logger.error('Erreur lors de la récupération des livres :', err);
    next(err);
  }
};

// Ajouter un livre
exports.addBook = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Aucun fichier téléchargé.');
    }

    if (!req.body.book) {
      res.status(400);
      throw new Error('Les données du livre sont manquantes.');
    }

    const bookData = JSON.parse(req.body.book);

    const book = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    const savedBook = await book.save();
    res.status(201).json({ message: 'Livre ajouté avec succès.', book: savedBook });
  } catch (err) {
    logger.error('Erreur lors de l\'ajout du livre :', err);
    next(err);
  }
};

// Récupérer un livre par ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Livre non trouvé.');
    }
    res.status(200).json(book);
  } catch (err) {
    logger.error('Erreur lors de la récupération d\'un livre :', err);
    next(err);
  }
};

// Modifier un livre
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Livre non trouvé.');
    }

    if (book.userId !== req.auth.userId) {
      logger.warn(`Tentative non autorisée : utilisateur ${req.auth.userId} tente de modifier le livre ${req.params.id}`);
      res.status(403);
      throw new Error('Requête non autorisée.');
    }

    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    res.status(200).json({ message: 'Livre modifié avec succès.', book: updatedBook });
  } catch (err) {
    logger.error('Erreur lors de la modification d\'un livre :', err);
    next(err);
  }
};

// Supprimer un livre (mis à jour pour inclure la suppression de l'image)
exports.deleteBook = async (req, res, next) => {
  try {
    // Trouver le livre à supprimer
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Livre non trouvé.');
    }

    // Vérifier que l'utilisateur est le créateur du livre
    if (book.userId !== req.auth.userId) {
      logger.warn(`Tentative non autorisée : utilisateur ${req.auth.userId} tente de supprimer le livre ${req.params.id}`);
      res.status(403);
      throw new Error('Requête non autorisée.');
    }

    // Supprimer l'image associée
    const imagePath = path.join(__dirname, '..', book.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, ''));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      logger.info(`Image supprimée : ${imagePath}`);
    } else {
      logger.warn(`Image introuvable lors de la suppression : ${imagePath}`);
    }

    // Supprimer le livre de la base de données
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Livre supprimé avec succès.' });
    logger.info(`Livre supprimé : ID ${req.params.id}`);
  } catch (err) {
    logger.error('Erreur lors de la suppression d\'un livre :', err);
    next(err);
  }
};

// Noter un livre
exports.rateBook = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const userId = req.auth.userId;

    if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
      res.status(400);
      throw new Error('La note doit être un nombre compris entre 0 et 5.');
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Livre introuvable.');
    }

    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      res.status(400);
      throw new Error('Vous avez déjà noté ce livre.');
    }

    book.ratings.push({ userId, grade: rating });
    book.averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (err) {
    logger.error('Erreur lors de la notation d\'un livre :', err);
    next(err);
  }
};

// Récupérer les 3 livres avec la meilleure moyenne
exports.getBestRatedBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (err) {
    logger.error('Erreur lors de la récupération des meilleurs livres :', err);
    next(err);
  }
};
