const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon Vieux Grimoire API',
      version: '1.0.0',
      description: 'API de gestion des livres pour Mon Vieux Grimoire.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Serveur local',
      },
    ],
  },
  apis: ['./routes/*.js'], // Chemins des fichiers contenant les annotations JSDoc
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpecs;
