const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Répertoire où les fichiers seront stockés
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    callback(null, name + '_' + timestamp + extension);
  },
});

// Vérification du type de fichier
const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true); // Accepte le fichier
  } else {
    callback(new Error('Type de fichier non supporté'), false);
  }
};

// Création du middleware
module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
}).single('image'); // Spécifie le champ attendu pour le fichier
