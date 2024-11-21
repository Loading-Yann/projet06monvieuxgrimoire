// 1. Importation des modules nécessaires
const express = require('express');        // Importation d'Express, un framework web qui facilite la création de serveurs HTTP.
const mongoose = require('mongoose');      // Importation de Mongoose, une bibliothèque qui simplifie l'interaction avec MongoDB.
const dotenv = require('dotenv');          // Importation de dotenv pour charger des variables d'environnement à partir d'un fichier `.env`.
const cors = require('cors');              // Importation de CORS pour gérer les demandes cross-origin entre ton frontend et ton backend.
const bookRoutes = require('./routes/book.routes'); // Importation des routes dédiées aux livres (dans `routes/book.routes.js`).
const authRoutes = require('./routes/auth.routes'); // Importation des routes pour l'authentification (dans `routes/auth.routes.js`).

// 2. Chargement des variables d'environnement
dotenv.config();  // Appelle dotenv pour charger les variables définies dans le fichier `.env` dans `process.env`.

// 3. Vérification des variables d'environnement
// Ces vérifications sont essentielles pour s'assurer que les configurations nécessaires sont présentes avant de démarrer le serveur.

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI est manquant dans le fichier .env');
  process.exit(1); // Si l'URI de la base de données MongoDB est manquante, on arrête l'application avec une erreur.
}

if (!process.env.PORT) {
  console.warn('PORT est manquant dans le fichier .env, utilisation de la valeur par défaut 4000');
  // Si le port n'est pas défini, un avertissement est affiché et le serveur sera lancé sur le port 4000 par défaut.
}

// 4. Création de l'application Express
const app = express();  // On crée une instance de l'application Express, qui permet de gérer les routes et la logique du serveur.

// 5. Middleware pour parser les requêtes JSON
app.use(express.json()); // Le middleware `express.json()` permet de parser les corps de requêtes JSON. Cela permet de récupérer facilement les données envoyées dans une requête POST ou PUT.

// 6. Configuration CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Définit l'URL du frontend autorisé à interagir avec le backend (généralement localhost pour les tests).
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Liste des méthodes HTTP autorisées.
  allowedHeaders: ['Content-Type', 'Authorization'], // Liste des en-têtes autorisés dans les requêtes.
}));

// 7. Connexion à MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connexion à MongoDB réussie !')) // Si la connexion réussit, un message de succès est affiché.
  .catch(err => {  // Si la connexion échoue, on capture l'erreur et on arrête le serveur.
    console.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1); // Arrêt du serveur en cas d'échec de la connexion.
  });

// 8. Routes principales pour les livres
app.use('/api/books', bookRoutes); // Toutes les requêtes commençant par `/api/books` seront gérées par le fichier `routes/book.routes.js`.

// 9. Routes d'authentification
app.use('/api/auth', authRoutes); // Toutes les requêtes commençant par `/api/auth` seront gérées par le fichier `routes/auth.routes.js`.

 // 10. Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' }); // Une route simple pour tester le serveur.
});

// 11. Définition du port
const PORT = process.env.PORT || 4000;  // On définit le port d'écoute du serveur. S'il n'est pas spécifié dans `.env`, on utilise 4000.

// 12. Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`); // Message affiché lorsque le serveur est lancé et écoute les requêtes.
});
