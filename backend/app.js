const express = require('express');        // Importation d'Express.
const mongoose = require('mongoose');      // Importation de Mongoose.
const dotenv = require('dotenv');          // Importation de dotenv pour charger les variables d'environnement.
const cors = require('cors');              // Importation de CORS.
const path = require('path');              // Importation de path pour gérer les fichiers statiques.
const bookRoutes = require('./routes/book.routes'); // Importation des routes des livres.
const authRoutes = require('./routes/auth.routes'); // Importation des routes d'authentification.
const errorHandler = require('./middlewares/errorHandler.middleware'); // Middleware global
const morgan = require('morgan');
const logger = require('./utils/logger'); // Logger Winston
const cron = require('node-cron');        // Importation de node-cron pour le job périodique.
const cleanupImages = require('./utils/cleanupImages'); 

// Chargement des variables d'environnement
dotenv.config();

// Vérification des variables d'environnement
if (!process.env.MONGO_URI) {
  logger.error('MONGO_URI est manquant dans le fichier .env');
  process.exit(1);
}

if (!process.env.PORT) {
  logger.warn('PORT est manquant dans le fichier .env, utilisation de la valeur par défaut 4000');
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

// Middleware pour les logs HTTP avec Morgan
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

// Connexion à MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('✅ Connexion à MongoDB réussie !'))
  .catch(err => {
    logger.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1);
  });

// Définition des routes
app.use('/api/books', bookRoutes); // Les routes pour les livres
app.use('/api/auth', authRoutes);  // Les routes pour l'authentification

// Fichiers statiques pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware global d'erreurs
app.use(errorHandler);

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' });
});

// Job périodique pour nettoyer les images orphelines
// Job périodique pour nettoyer les images orphelines
cron.schedule('0 0 * * *', async () => { // Exemple : tous les jours à minuit
  logger.info('⏰ Début du job périodique de nettoyage des images.');
  try {
    await cleanupImages();
    logger.info('✅ Fin du job périodique de nettoyage des images.');
  } catch (err) {
    logger.error('❌ Erreur pendant le job périodique :', err);
  }
});

module.exports = app; // Export de l'instance Express