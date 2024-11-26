const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger');
const cleanupImages = require('../utils/cleanupImages');

// Charger les variables d'environnement
dotenv.config();

(async () => {
  try {
    // Connexion indépendante à la base de données
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ Connexion à MongoDB réussie pour le script de nettoyage.');

    // Lancer le nettoyage
    await cleanupImages();

    logger.info('✅ Nettoyage terminé avec succès.');
  } catch (err) {
    logger.error('❌ Erreur dans le script de nettoyage :', err);
  } finally {
    // Déconnexion propre
    await mongoose.disconnect();
    logger.info('🔌 Connexion MongoDB fermée pour le script de nettoyage.');
    process.exit();
  }
})();
