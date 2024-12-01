const rateLimit = require('express-rate-limit');

// Configuration du middleware de limitation des requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite de 100 requêtes par IP
  message: {
    status: 429,
    error: 'Trop de requêtes effectuées depuis cette IP. Veuillez réessayer plus tard.',
  },
  standardHeaders: true, // Ajoute les informations de limite dans les en-têtes standard
  legacyHeaders: false, // Désactive les en-têtes X-RateLimit obsolètes
});

module.exports = limiter;
