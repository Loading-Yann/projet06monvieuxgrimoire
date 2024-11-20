const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Connexion à MongoDB échouée :', err));

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur le serveur backend !' });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
