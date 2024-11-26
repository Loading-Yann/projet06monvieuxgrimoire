const mongoose = require('mongoose');

// Obtenir l'année actuelle
const currentYear = new Date().getFullYear();

// Schéma des évaluations
const ratingSchema = mongoose.Schema({
  userId: { 
    type: String, 
    required: true // ID de l'utilisateur qui a noté 
  },
  grade: { 
    type: Number, 
    required: true, 
    min: 0, // Note minimale
    max: 5  // Note maximale
  }
});

// Schéma des livres
const bookSchema = mongoose.Schema({
  userId: { 
    type: String, 
    required: true // ID de l'utilisateur créateur
  },
  title: { 
    type: String, 
    required: true, // Le titre est obligatoire
    trim: true, // Suppression des espaces inutiles
    minlength: 1 // Autorise des titres d'au moins un caractère
  },
  author: { 
    type: String, 
    required: true, // L'auteur est obligatoire
    trim: true, 
    minlength: 2 // L'auteur doit contenir au moins 2 caractères significatifs
  },
  genre: { 
    type: String, 
    required: true, // Le genre est obligatoire
    trim: true 
  },
  year: { 
    type: Number, 
    required: true, // L'année de publication est obligatoire
    min: -Infinity, // Autorise les dates avant J.-C.
    max: currentYear + 15 // Interdit une date trop éloignée dans le futur
  },
  imageUrl: { 
    type: String, 
    required: true // Une URL d'image est obligatoire
  },
  ratings: [ratingSchema], // Liste des évaluations
  averageRating: { 
    type: Number, 
    default: 0, // Par défaut, 0
    min: 0, // La moyenne doit être au minimum 0
    max: 5  // La moyenne doit être au maximum 5
  }
});

// Modèle "Book"
module.exports = mongoose.model('Book', bookSchema);
