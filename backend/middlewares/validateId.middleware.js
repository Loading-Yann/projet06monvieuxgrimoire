  const mongoose = require('mongoose');

  module.exports = (req, res, next) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('ID invalide :', id);
      return res.status(400).json({ message: 'ID invalide.' });
    }

    next();
  };
