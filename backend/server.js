// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes'); // Déplacement ici

// Chargement des variables d'environnement
dotenv.config();

// Vérification de la présence des variables d'environnement critiques
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI est manquant dans le fichier .env');
  process.exit(1); // Arrête le serveur si la config est invalide
}
if (!process.env.PORT) {
  console.warn('PORT est manquant dans le fichier .env, utilisation de la valeur par défaut 4000');
}

// Création de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch(err => {
    console.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1); // Arrête le serveur si la DB est inaccessible
  });

// Routes principales pour les livres
app.use('/api/books', bookRoutes);

// Routes d'authentification
app.use('/api/auth', authRoutes); // Placé correctement

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' });
});

// Définition du port
const PORT = process.env.PORT || 4000;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
