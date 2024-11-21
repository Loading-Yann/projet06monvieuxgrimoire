const Book = require('../models/book.model');

// Fonction pour récupérer tous les livres
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Trouve tous les livres dans la DB
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Fonction pour ajouter un livre
exports.addBook = async (req, res) => {
  try {
    const book = new Book({ ...req.body }); // Crée un nouveau livre avec les données du corps de la requête
    await book.save();
    res.status(201).json({ message: 'Livre ajouté avec succès', book });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Fonction pour modifier un livre
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json({ message: 'Livre modifié avec succès', book });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Fonction pour supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Obtenir les livres les mieux notés
exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(5);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};
