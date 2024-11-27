const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const auth = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer-config');
const validateId = require('../middlewares/validateId.middleware');

/**
 * @swagger
 * /api/books/bestrating:
 *   get:
 *     summary: Récupérer les 3 meilleurs livres
 *     description: Renvoie les 3 livres ayant la meilleure note moyenne.
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/bestrating', bookController.getBestRatedBooks);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Récupérer tous les livres
 *     description: Renvoie un tableau contenant tous les livres de la base de données.
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', bookController.getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Récupérer un livre par ID
 *     description: Renvoie les détails d'un livre spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.get('/:id', validateId, bookController.getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Ajouter un nouveau livre
 *     description: Ajoute un livre dans la base de données.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *                 description: Détails du livre en JSON
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image du livre
 *     responses:
 *       201:
 *         description: Livre ajouté avec succès.
 */
router.post('/', auth, multer, bookController.addBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Modifier un livre
 *     description: Met à jour les informations d'un livre existant.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *                 description: Détails du livre en JSON
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image du livre
 *     responses:
 *       200:
 *         description: Livre modifié avec succès.
 */
router.put('/:id', auth, validateId, multer, bookController.updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Supprimer un livre
 *     description: Supprime un livre de la base de données.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès.
 */
router.delete('/:id', auth, validateId, bookController.deleteBook);

/**
 * @swagger
 * /api/books/{id}/rating:
 *   post:
 *     summary: Noter un livre
 *     description: Ajoute une note à un livre spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID de l'utilisateur
 *               rating:
 *                 type: number
 *                 description: Note du livre (0 à 5)
 *     responses:
 *       200:
 *         description: Livre noté avec succès.
 */
router.post('/:id/rating', auth, validateId, bookController.rateBook);

module.exports = router;
