//Fonction qui vérifie le token de l'utilisateur, donne son id et passe next

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Récupère le header Authorization
    if (!authHeader) {
      res.status(401).json({ message: 'Non autorisé.' });
    }

    const token = authHeader.split(' ')[1]; // Récupère le token

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifie et décode le token

    req.auth = { userId: decodedToken.userId }; // Ajoute l'ID utilisateur à la requête
    next();
  } catch (err) {
    res.status(401).json({ message: 'Non autorisé.' });
  }
};
