// src/controllers/AuthController.js
const UserService = require('../services/UserService');
const logger = require('../utils/logger');

class AuthController {
  constructor() {
    this.userService = new UserService();
  }

  // POST /api/auth/register
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      }

      const userDTO = await this.userService.register({
        email,
        password,
        firstName,
        lastName
      });

      return res.status(201).json(userDTO);
    } catch (error) {
      logger.error('Error en register', error);
      return res.status(400).json({
        error: error.message || 'Error registrando usuario'
      });
    }
  }

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      }

      const result = await this.userService.login(email, password);
      // result = { token, user }

      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error en login', error);
      return res.status(401).json({
        error: error.message || 'Credenciales inválidas'
      });
    }
  }

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      // Con JWT stateless no hay logout en servidor,
      // simplemente respondemos OK. Se podría manejar blacklist en BD si quisieras.
      logger.log(`User logged out: ${req.user?.email || 'unknown'}`);
      return res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      logger.error('Error en logout', error);
      return res.status(500).json({ error: 'Error cerrando sesión' });
    }
  }

  // GET /api/auth/profile
  async getProfile(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const userDTO = await this.userService.getUserById(userId);
      return res.status(200).json(userDTO);
    } catch (error) {
      logger.error('Error obteniendo perfil', error);
      return res.status(404).json({
        error: error.message || 'Usuario no encontrado'
      });
    }
  }
}

module.exports = AuthController;
