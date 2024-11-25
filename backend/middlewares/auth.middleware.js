const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Récupère le header Authorization
    if (!authHeader) {
      console.log('Aucun token trouvé dans la requête.');
      return res.status(401).json({ message: 'Non autorisé : aucun token fourni.' });
    }

    const token = authHeader.split(' ')[1]; // Récupère le token
    console.log('Token reçu :', token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifie et décode le token
    console.log('Token décodé :', decodedToken);

    req.auth = { userId: decodedToken.userId }; // Ajoute l'ID utilisateur à la requête
    next();
  } catch (err) {
    console.error('Erreur lors de la vérification du token :', err);
    res.status(401).json({ message: 'Non autorisé : token invalide.', error: err });
  }
};
