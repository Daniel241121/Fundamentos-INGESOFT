// src/controllers/ProductController.js
const { DatabaseConnection } = require('../config/database');
const logger = require('../utils/logger');

class ProductController {
  constructor() {
    this.db = DatabaseConnection.getInstance();
    // 👇 IMPORTANTE: quitamos los .bind() que estaban rompiendo
    // this.searchProducts = this.searchProducts.bind(this);
    // this.getProductById = this.getProductById.bind(this);
    // this.createProduct = this.createProduct.bind(this);
  }

  // Buscar productos por query (simple)
  async searchProducts(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const sql = `
        SELECT *
        FROM products
        WHERE name ILIKE $1 OR description ILIKE $1
        ORDER BY created_at DESC
        LIMIT 20
      `;

      const rows = await this.db.query(sql, [`%${query}%`]);
      return res.json(rows);
    } catch (err) {
      logger.error('Error searching products', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Obtener producto por ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const sql = `SELECT * FROM products WHERE id = $1`;
      const rows = await this.db.query(sql, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json(rows[0]);
    } catch (err) {
      logger.error('Error fetching product by ID', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Crear producto (con DB)
  async createProduct(req, res) {
    const start = Date.now();
    logger.log('➡️ [createProduct] Inicio handler');

    try {
      const { name, description, category, externalLink } = req.body;
      logger.log('➡️ [createProduct] Body: ' + JSON.stringify(req.body));
      logger.log('➡️ [createProduct] User: ' + JSON.stringify(req.user));

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
      }

      const sql = `
        INSERT INTO products (name, description, category, external_link)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [
        name,
        description || null,
        category || null,
        externalLink || null,
      ];

      logger.log('➡️ [createProduct] Ejecutando INSERT en DB');

      const timeoutId = setTimeout(() => {
        logger.error('⏰ [createProduct] La consulta a la DB está tardando demasiado');
      }, 10000);

      const rows = await this.db.query(sql, values);

      clearTimeout(timeoutId);

      logger.log('✅ [createProduct] INSERT completado, rows.length = ' + rows.length);

      const product = rows[0];

      logger.log(`✅ Product created: ${product.id}`);

      return res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (err) {
      logger.error('❌ [createProduct] Error creando producto', err);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      logger.log(`ℹ️ [createProduct] Total time: ${Date.now() - start} ms`);
    }
  }
}

module.exports = ProductController;
