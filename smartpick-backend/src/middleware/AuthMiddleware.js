// src/middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class AuthMiddleware {
  static authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Esperamos: "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Token verification failed', error);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  static authorizeRole(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }
}

module.exports = AuthMiddleware;
