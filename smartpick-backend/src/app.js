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

// Error handling middleware (más defensivo)
app.use((err, req, res, next) => {
  try {
    logger.error('Unhandled error', err);
  } catch (logErr) {
    console.error('Logger failed', logErr);
  }

  if (res.headersSent) {
    // Si Express ya empezó a responder, delega al manejador por defecto
    return next(err);
  }

  res.status(err && err.status ? err.status : 500);

  try {
    res.json({
      error: err && err.message ? err.message : 'Internal server error',
    });
  } catch (jsonErr) {
    // Último recurso: texto plano
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal server error');
  }
});


// 404 final
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
