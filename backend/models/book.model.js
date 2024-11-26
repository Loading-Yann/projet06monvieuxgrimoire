const mongoose = require('mongoose');

// Schéma des évaluations
const ratingSchema = mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur qui note
  grade: { 
    type: Number, 
    required: true, 
    min: [0, 'La note doit être au minimum 0.'], 
    max: [5, 'La note doit être au maximum 5.'] 
  }
});

// Schéma des livres
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur créateur
  title: { type: String, required: [true, 'Le titre est obligatoire.'], trim: true },
  author: { type: String, required: [true, 'L\'auteur est obligatoire.'], trim: true },
  genre: { type: String, required: [true, 'Le genre est obligatoire.'], trim: true },
  year: { 
    type: Number, 
    required: [true, 'L\'année de publication est obligatoire.'],
    min: [0, 'L\'année doit être un nombre positif.']
  },
  imageUrl: { type: String, required: [true, 'Une image est obligatoire.'] },
  ratings: [ratingSchema], // Tableau des évaluations
  averageRating: { 
    type: Number, 
    default: 0, 
    min: [0, 'La moyenne doit être au minimum 0.'], 
    max: [5, 'La moyenne doit être au maximum 5.'] 
  }
});

// Modèle "Book"
module.exports = mongoose.model('Book', bookSchema);
