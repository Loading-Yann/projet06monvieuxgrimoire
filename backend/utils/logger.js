const winston = require('winston');

// Configuration des niveaux de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Création du logger
const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] : ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Logs dans la console
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }), // Erreurs dans un fichier
    new winston.transports.File({ filename: 'logs/combined.log' }), // Tous les logs dans un autre fichier
  ],
});

module.exports = logger;
