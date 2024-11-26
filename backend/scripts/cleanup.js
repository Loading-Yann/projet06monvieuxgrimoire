const mongoose = require('mongoose');
const logger = require('../utils/logger');
const cleanupImages = require('../utils/cleanupImages');

(async () => {
  try {
    // Connexion indépendante pour le script
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
    // Déconnexion de MongoDB
    await mongoose.disconnect();
    logger.info('🔌 Connexion MongoDB fermée pour le script de nettoyage.');
    process.exit(); // Termine proprement le script
  }
})();
