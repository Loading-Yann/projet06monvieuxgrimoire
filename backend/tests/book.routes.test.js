const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let testToken;

// Fonction pour générer un utilisateur et un token JWT valide
const generateTestUserAndToken = async () => {
  const email = 'testuser@example.com';
  const password = 'password123';

  // Vérifie si l'utilisateur de test existe déjà
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
    });
  }

  const response = await request(app).post('/api/auth/login').send({ email, password });

  if (response.status !== 200) {
    throw new Error('Impossible de générer un token JWT valide');
  }

  return response.body.token;
};

// Fonction pour extraire l'userId du token
const getUserIdFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId;
};

// Connexion à MongoDB avant les tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  testToken = await generateTestUserAndToken();
});

// Nettoyage après chaque test
afterEach(async () => {
  await Book.deleteMany({});
  const imageFolder = './images';
  const files = fs.readdirSync(imageFolder);
  files.forEach((file) => {
    if (file.startsWith('sample')) {
      fs.unlinkSync(`${imageFolder}/${file}`);
    }
  });
});

// Déconnexion après les tests
afterAll(async () => {
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
      .set('Authorization', `Bearer ${testToken}`)
      .attach('image', 'tests/sample.jpg')
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
      userId: 'fakeUserId123',
    });

    const response = await request(app).get(`/api/books/${book._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(book.title);
  });

  test('DELETE /api/books/:id - devrait supprimer un livre', async () => {
    const userId = getUserIdFromToken(testToken);

    const book = await Book.create({
      title: 'To Be Deleted',
      author: 'Author',
      year: 1990,
      genre: 'Fiction',
      imageUrl: 'test.jpg',
      userId,
    });

    const response = await request(app)
      .delete(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Livre supprimé avec succès.');
  });
});
