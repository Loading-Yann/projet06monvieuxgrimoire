const Book = require('../models/book.model');

// Récupérer tous les livres
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error('Erreur lors de la récupération des livres :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Ajouter un livre
exports.addBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    if (!req.body.book) {
      return res.status(400).json({ message: 'Les données du livre sont manquantes.' });
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
    console.error('Erreur lors de l\'ajout du livre :', err);
    res.status(400).json({ message: 'Données invalides.', error: err.message });
  }
};

// Récupérer un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    res.status(200).json(book);
  } catch (err) {
    console.error('Erreur lors de la récupération du livre :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Modifier un livre
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Requête non autorisée.' });
    }

    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    res.status(200).json({ message: 'Livre modifié avec succès.', book: updatedBook });
  } catch (err) {
    console.error('Erreur lors de la modification du livre :', err);
    res.status(400).json({ message: 'Données invalides.', error: err.message });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Requête non autorisée.' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Livre supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la suppression du livre :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Noter un livre
exports.rateBook = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.auth.userId;

    if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être un nombre compris entre 0 et 5.' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }

    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ userId, grade: rating });
    book.averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error('Erreur lors de la notation du livre :', err);
    res.status(400).json({ message: 'Données invalides.', error: err.message });
  }
};

// Récupérer les 3 livres avec la meilleure moyenne
exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (err) {
    console.error('Erreur lors de la récupération des meilleurs livres :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
