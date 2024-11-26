const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Book = require('../models/book.model');
const fs = require('fs');

// Connexion à MongoDB avant les tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Nettoyer la base et supprimer les fichiers générés après chaque test
afterEach(async () => {
  // Suppression des livres dans la base de données
  await Book.deleteMany({});

  // Recherche et suppression des fichiers générés par les tests
  const imageFolder = './images';
  const files = fs.readdirSync(imageFolder);

  files.forEach((file) => {
    if (file.startsWith('sample')) {
      const filePath = `${imageFolder}/${file}`;
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Erreur lors de la suppression du fichier ${filePath} : ${error.message}`);
      }
    }
  });
});

// Déconnexion après les tests
afterAll(async () => {
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Délai pour fermer proprement les connexions
});

describe('Tests pour les routes /api/books', () => {
  test('GET /api/books - devrait renvoyer un tableau de livres', async () => {
    const response = await request(app).get('/api/books');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/books - devrait ajouter un livre', async () => {
    const response = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN}`) // Token valide
      .attach('image', 'tests/sample.jpg') // Ajout d'un fichier image
      .field(
        'book',
        JSON.stringify({
          title: 'Test Book',
          author: 'Test Author',
          year: 2020,
          genre: 'Test Genre',
        })
      );

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Livre ajouté avec succès.');
  });

  test('GET /api/books/:id - devrait renvoyer un livre spécifique', async () => {
    const book = await Book.create({
      title: 'Existing Book',
      author: 'Author',
      year: 1990,
      genre: 'Fiction',
      imageUrl: 'test.jpg',
      userId: 'fakeUserId123', // Ajout d'un userId
    });

    const response = await request(app).get(`/api/books/${book._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(book.title);
  });

  test('DELETE /api/books/:id - devrait supprimer un livre', async () => {
    const book = await Book.create({
      title: 'To Be Deleted',
      author: 'Author',
      year: 1990,
      genre: 'Fiction',
      imageUrl: 'test.jpg',
      userId: 'fakeUserId123', // Ajout d'un userId
    });

    const response = await request(app)
      .delete(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Livre supprimé avec succès.');
  });
});
