// src/routes/review.routes.js
const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ message: 'Review routes OK (placeholder)' });
});

module.exports = router;
