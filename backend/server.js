const app = require('./app'); // Importation de l'application Express

const errorHandler = require('./middlewares/errorHandler.middleware'); // Middleware global d'erreurs

// Middleware global d'erreurs
app.use(errorHandler);

// Définition du port
const PORT = process.env.PORT || 4000;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
