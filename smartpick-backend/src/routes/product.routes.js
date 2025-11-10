// src/routes/product.routes.js
const express = require('express');
const ProductController = require('../controllers/ProductController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();
const productController = new ProductController();

// Buscar productos (pública)
router.get('/search', (req, res) => productController.searchProducts(req, res));

// Resumen HU1 (pública)
router.get('/:id/summary', (req, res) =>
  productController.getProductSummary(req, res)
);

// Analítica para gráficas (pública)
router.get('/:id/review-analytics', (req, res) =>
  productController.getReviewAnalytics(req, res)
);

// Historial de precios (pública)
router.get('/:id/price-history', (req, res) =>
  productController.getPriceHistory(req, res)
);

// Comparación de precios actual (HU2)
router.get('/:id/price-comparison', (req, res) =>
  productController.getPriceComparison(req, res)
);

// Listar reseñas con filtro por sentimiento (HU3)
router.get('/:id/reviews', (req, res) =>
  productController.listReviews(req, res)
);

// Crear reseña (requiere estar logueado)
router.post(
  '/:id/reviews',
  AuthMiddleware.authenticateToken,
  (req, res) => productController.createReview(req, res)
);

// Obtener producto por ID (pública)
router.get('/:id', (req, res) => productController.getProductById(req, res));

// Crear producto (requiere autenticación y rol válido)
router.post(
  '/',
  AuthMiddleware.authenticateToken,
  AuthMiddleware.authorizeRole('ADMIN', 'BUYER', 'SELLER', 'ANALYST'),
  (req, res) => productController.createProduct(req, res)
);

module.exports = router;
