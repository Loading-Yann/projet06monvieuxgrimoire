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
    console.log('Headers :', req.headers);
    console.log('Données reçues (req.body.book) :', req.body.book);
    console.log('Fichier reçu (req.file) :', req.file);

    // Vérifie si le fichier a été envoyé
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    // Vérifie si les données du livre sont présentes
    if (!req.body.book) {
      return res.status(400).json({ message: 'Les données du livre sont manquantes.' });
    }

    // Parse les données du livre envoyées sous forme de JSON
    const bookData = JSON.parse(req.body.book);

    const book = new Book({
      ...bookData,
      userId: req.auth.userId, // Ajoute l'ID utilisateur depuis le token
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      averageRating: 0,
      ratings: [],
    });

    await book.save(); // Enregistre le livre dans la base de données
    console.log('Livre enregistré avec succès :', book);

    res.status(201).json({ message: 'Livre ajouté avec succès', book });
  } catch (err) {
    console.error('Erreur lors de l\'ajout du livre :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


exports.getBookById = async (req, res) => {
  try {
    console.log('Requête pour le livre ID :', req.params.id); // Log de l'ID reçu
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.warn('Livre non trouvé pour ID :', req.params.id);
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(book);
  } catch (err) {
    console.error('Erreur lors de la récupération du livre :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


//Modifier un livre
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    if (req.auth.userId !== book.userId) {
      return res.status(403).json({ message: 'Requête non autorisée.' });
    }

    if (req.file) {
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    res.status(200).json({ message: 'Livre modifié avec succès.', updatedBook });
  } catch (err) {
    console.error('Erreur lors de la modification du livre :', err);
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
