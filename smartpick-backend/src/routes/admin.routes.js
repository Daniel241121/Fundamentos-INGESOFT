// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard placeholder' });
});

module.exports = router;
