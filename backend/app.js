const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const logger = require('./utils/logger');
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerOptions'); 
const cleanupImages = require('./utils/cleanupImages');
const rateLimit = require('express-rate-limit');

// Routes
const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

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

// Configuration Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware pour limiter les requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par fenêtre de temps
  message: {
    status: 429,
    error: 'Trop de requêtes effectuées depuis cette IP. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter); // Appliquer la limitation globalement

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware pour les logs HTTP avec Morgan
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('✅ Connexion à MongoDB réussie !'))
  .catch((err) => {
    logger.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1);
  });

// Définition des routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Fichiers statiques pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware global pour gérer les erreurs
app.use(errorHandler);

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' });
});

// Job périodique pour nettoyer les images orphelines
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('0 0 * * *', async () => {
    logger.info('⏰ Début du job périodique de nettoyage des images.');
    try {
      await cleanupImages();
      logger.info('✅ Fin du job périodique de nettoyage des images.');
    } catch (err) {
      logger.error('❌ Erreur pendant le job périodique :', err);
    }
  });
}

module.exports = app;
