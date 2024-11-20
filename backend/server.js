// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bookRoutes = require('./routes/book.routes');

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config();

// Création de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration CORS pour autoriser les requêtes du frontend
// Si le frontend est sur un autre port (par exemple : 3000), ajoutez cette adresse.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Origine autorisée
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes HTTP autorisés
}));

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Connexion à MongoDB échouée :', err));

// Optionnel : insérer des données initiales depuis un fichier JSON
const seedDatabase = async () => {
  const Book = require('./models/book.model'); // Importation du modèle Book
  const data = require('./data/data.json'); // Chargement du fichier JSON
  try {
    await Book.insertMany(data); // Insertion des données dans MongoDB
    console.log('Données initiales insérées');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données initiales :', error);
  }
};
// Décommenter pour exécuter une seule fois lors de l'initialisation
// seedDatabase();

// Routes principales pour les livres
app.use('/api/books', bookRoutes);

// Route de test (utile pour vérifier que le serveur fonctionne)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' });
});

// Définition du port à partir des variables d'environnement ou d'une valeur par défaut
const PORT = process.env.PORT || 4000;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
