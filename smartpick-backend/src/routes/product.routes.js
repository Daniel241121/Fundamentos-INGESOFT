// src/routes/product.routes.js
const express = require('express');
const ProductController = require('../controllers/ProductController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();
const controller = new ProductController();

// Buscar productos ?query=...
router.get('/', (req, res) => controller.searchProducts(req, res));

// Obtener un producto por ID
router.get('/:id', (req, res) => controller.getProductById(req, res));

// Comparar precios de un producto
router.get('/:id/compare-price', (req, res) => controller.comparePrice(req, res));

// Crear producto (solo ADMIN o SELLER, si luego quieres usar roles)
router.post(
  '/',
  AuthMiddleware.authenticateToken,
  AuthMiddleware.authorizeRole('ADMIN', 'SELLER'),
  (req, res) => controller.createProduct(req, res)
);

module.exports = router;
