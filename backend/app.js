const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const logger = require('./utils/logger');

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

// Morgan pour journaliser les requêtes HTTP
app.use(morgan('combined', { stream: { write: message => logger.http(message.trim()) } }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('✅ Connexion à MongoDB réussie !'))
  .catch(err => {
    logger.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1);
  });

// Fichiers statiques pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Middleware global d'erreurs
app.use(errorHandler);

// Exporter l'application
module.exports = app;
