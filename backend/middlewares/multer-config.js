const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log('Définition du répertoire de stockage...');
    const dir = 'images';
    if (!fs.existsSync(dir)) {
      console.log('Création du répertoire :', dir);
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    console.log('Définition du nom du fichier...');
    const name = file.originalname.split(' ').join('_').replace(/[^a-zA-Z0-9_.-]/g, '');
    const extension = path.extname(file.originalname);
    console.log('Nom original :', file.originalname, '| Nom généré :', `${name}_${Date.now()}${extension}`);
    callback(null, `${name}_${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  console.log('Type de fichier reçu :', file.mimetype);
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    console.error('Type de fichier non supporté :', file.mimetype);
    callback(new Error('Format de fichier non pris en charge.'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = (req, res, next) => {
  console.log('Passage dans le middleware Multer...');
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Erreur Multer :', err.message);
      return res.status(400).json({ message: err.message });
    }

    if (req.file) {
      try {
        console.log('Fichier reçu :', req.file);
        const { path: filePath } = req.file;
        const optimizedFilePath = `${filePath.split('.').slice(0, -1).join('.')}-optimized.webp`;

        console.log('Optimisation du fichier avec Sharp...');
        await sharp(filePath)
          .resize({ width: 800 }) // Redimensionner
          .toFormat('webp') // Convertir en WebP
          .webp({ quality: 80 }) // Compression
          .toFile(optimizedFilePath);

        fs.unlinkSync(filePath); // Supprimer l'original
        console.log('Fichier optimisé :', optimizedFilePath);

        req.file.path = optimizedFilePath;
        req.file.filename = path.basename(optimizedFilePath);
      } catch (sharpError) {
        console.error('Erreur lors de l\'optimisation de l\'image :', sharpError);
        return res.status(500).json({ message: 'Erreur lors de l\'optimisation de l\'image.' });
      }
    }

    console.log('Middleware Multer terminé.');
    next();
  });
};
