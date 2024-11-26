const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Book = require('../models/book.model'); // Modèle des livres
const logger = require('../utils/logger');   // Winston pour les logs
require('dotenv').config();                  // Charger les variables d'environnement

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('✅ Connexion à MongoDB réussie pour le script de nettoyage.');
    cleanupImages(); // Lancer le nettoyage
  })
  .catch(err => {
    logger.error('❌ Connexion à MongoDB échouée :', err);
    process.exit(1);
  });

// Nettoyer les fichiers orphelins
async function cleanupImages() {
  try {
    const imagesDir = path.join(__dirname, '..', 'images'); // Dossier des images
    const files = fs.readdirSync(imagesDir); // Lire tous les fichiers du dossier images
    logger.info(`📂 Nombre de fichiers trouvés dans le dossier images : ${files.length}`);

    // Récupérer toutes les URLs d'images dans la base de données
    const books = await Book.find({}, 'imageUrl'); // On ne récupère que les URLs des images
    const imageUrls = books.map(book => book.imageUrl);

    // Vérifier chaque fichier du dossier
    let orphans = 0;
    files.forEach(file => {
      const filePath = `${process.env.BASE_URL || 'http://localhost:4000'}/images/${file}`;
      if (!imageUrls.includes(filePath)) {
        // Supprimer les fichiers non référencés dans la base de données
        fs.unlinkSync(path.join(imagesDir, file));
        logger.info(`🗑️ Fichier orphelin supprimé : ${file}`);
        orphans++;
      }
    });

    logger.info(`✅ Nettoyage terminé : ${orphans} fichier(s) orphelin(s) supprimé(s).`);
    process.exit(0); // Terminer le script
  } catch (err) {
    logger.error('❌ Erreur lors du nettoyage des fichiers orphelins :', err);
    process.exit(1);
  }
}
