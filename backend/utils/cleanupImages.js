const fs = require('fs');
const path = require('path');
const Book = require('../models/book.model');
const logger = require('./logger');

const cleanupImages = async () => {
  const imageDir = path.join(__dirname, '../images');
  const files = fs.readdirSync(imageDir);

  // Récupérer les URL des images des livres dans la base de données
  const books = await Book.find();
  const bookImagePaths = books.map(book => book.imageUrl.split('/images/')[1]);

  let deletedCount = 0;

  // Parcourir les fichiers dans le répertoire d'images
  files.forEach(file => {
    if (!bookImagePaths.includes(file)) {
      const filePath = path.join(imageDir, file);
      fs.unlinkSync(filePath); // Supprimer le fichier
      logger.info(`🗑️ Fichier orphelin supprimé : ${file}`);
      deletedCount++;
    }
  });

  logger.info(`✅ Nettoyage terminé : ${deletedCount} fichier(s) orphelin(s) supprimé(s).`);
};

module.exports = cleanupImages;
