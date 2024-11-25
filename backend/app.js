// app.js

const express = require('express');        // Importation d'Express.
const mongoose = require('mongoose');      // Importation de Mongoose.
const dotenv = require('dotenv');          // Importation de dotenv pour charger les variables d'environnement.
const cors = require('cors');              // Importation de CORS.
const bookRoutes = require('./routes/book.routes'); // Importation des routes des livres.
const authRoutes = require('./routes/auth.routes'); // Importation des routes d'authentification.

// Chargement des variables d'environnement
dotenv.config();

// Vérification des variables d'environnement
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI est manquant dans le fichier .env');
  process.exit(1);
}

if (!process.env.PORT) {
  console.warn('PORT est manquant dans le fichier .env, utilisation de la valeur par défaut 4000');
}

// Création de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connexion à MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch(err => {
    console.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1);
  });

// Définition des routes
app.use('/api/books', bookRoutes); // Les routes pour les livres
app.use('/api/auth', authRoutes);   // Les routes pour l'authentification

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' });
});

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));


// Exporter l'application Express pour l'utiliser dans `server.js`
module.exports = app;
