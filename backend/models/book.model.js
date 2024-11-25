const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur qui crée le livre
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String }, // URL de l'image
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 }, // Moyenne des notes
});

module.exports = mongoose.model('Book', bookSchema);
