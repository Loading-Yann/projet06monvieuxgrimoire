const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('Vérification de l\'authentification...');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('Aucun header Authorization fourni.');
      return res.status(401).json({ message: 'Non autorisé : aucun token fourni.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token reçu :', token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé :', decodedToken);

    req.auth = { userId: decodedToken.userId };
    console.log('Utilisateur authentifié avec l\'ID :', decodedToken.userId);

    next();
  } catch (err) {
    console.error('Erreur lors de la vérification du token :', err.message);
    res.status(401).json({ message: 'Non autorisé.', error: err.message });
  }
};
