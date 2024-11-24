// server.js

const app = require('./app');  // Importation de l'application Express depuis `app.js`

// Définition du port
const PORT = process.env.PORT || 4000;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
