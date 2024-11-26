const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../utils/logger');

// Inscription
exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    logger.error('Erreur lors de l\'inscription :', err);
    next(err);
  }
};

// Connexion
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401);
      throw new Error('Utilisateur non trouvé');
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      res.status(401);
      throw new Error('Mot de passe incorrect');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    logger.error('Erreur lors de la connexion :', err);
    next(err);
  }
};
