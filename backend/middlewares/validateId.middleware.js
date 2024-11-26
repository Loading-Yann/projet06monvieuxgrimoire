const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  console.log('Route appelée :', req.originalUrl);
  console.log('Paramètres :', req.params);

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error('ID invalide :', id);
    return res.status(400).json({ message: 'ID invalide.' });
  }
  console.log('ID valide :', id);
  next();
};
