// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const adminRoutes = require('./routes/admin.routes');
const logger = require('./utils/logger');

const app = express();

// Middleware base
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.log(`${req.method} ${req.path}`);
  next();
});

// ✅ Ruta raíz para probar rápido en el navegador
app.get('/', (req, res) => {
  res.json({
    message: 'SmartPick API is running 🚀',
    status: 'ok',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Middleware de errores
app.use((error, req, res, next) => {
  logger.error('Unhandled error', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
  });
});

// 404 final
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
