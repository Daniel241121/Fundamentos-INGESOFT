// src/services/ProductService.js
const { DatabaseConnection } = require('../config/database');
const logger = require('../utils/logger');

class ProductService {
  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  // Buscar productos por texto
  async searchProducts(query) {
    try {
      if (!query || query.length < 2) {
        throw new Error('Query must be at least 2 characters');
      }

      const sql = `
        SELECT id, name, description, category, external_link, created_at, updated_at
        FROM products
        WHERE name ILIKE $1 OR description ILIKE $1
        ORDER BY created_at DESC
        LIMIT 20;
      `;

      const rows = await this.db.query(sql, [`%${query}%`]);
      return rows;
    } catch (error) {
      logger.error('Error in ProductService.searchProducts', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const sql = `
        SELECT id, name, description, category, external_link, created_at, updated_at
        FROM products
        WHERE id = $1
        LIMIT 1;
      `;

      const rows = await this.db.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error in ProductService.getProductById', error);
      throw error;
    }
  }

  // Crear producto nuevo
  async createProduct({ name, description, category, externalLink }) {
    try {
      if (!name) {
        throw new Error('Name is required');
      }

      const sql = `
        INSERT INTO products (name, description, category, external_link)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, description, category, external_link, created_at, updated_at;
      `;

      const rows = await this.db.query(sql, [
        name,
        description || null,
        category || null,
        externalLink || null,
      ]);

      return rows[0];
    } catch (error) {
      logger.error('Error in ProductService.createProduct', error);
      throw error;
    }
  }

  // Comparar precios (simulado, demo)
  async comparePrice(productId) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      return {
        productId,
        productName: product.name,
        stores: [
          {
            store: 'Amazon',
            price: 999.99,
            link: product.external_link || null,
          },
          {
            store: 'eBay',
            price: 950.5,
            link: product.external_link || null,
          },
          {
            store: 'Mercado Libre',
            price: 970.0,
            link: product.external_link || null,
          },
        ],
        lastUpdated: new Date(),
      };
    } catch (error) {
      logger.error('Error in ProductService.comparePrice', error);
      throw error;
    }
  }
}

// 👈 IMPORTANTE: exportamos SOLO la clase
module.exports = ProductService;
