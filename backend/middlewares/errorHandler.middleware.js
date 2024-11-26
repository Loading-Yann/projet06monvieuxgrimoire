module.exports = (err, req, res, next) => {
  console.error('Erreur capturée par le middleware global :', err.message);

  // Définir un code de statut par défaut
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Une erreur est survenue.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Masquer les détails en production
  });
};
