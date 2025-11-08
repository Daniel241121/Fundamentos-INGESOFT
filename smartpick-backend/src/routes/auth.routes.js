const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', AuthMiddleware.authenticateToken, (req, res) => authController.logout(req, res));
router.get('/profile', AuthMiddleware.authenticateToken, (req, res) => authController.getProfile(req, res));

module.exports = router;
