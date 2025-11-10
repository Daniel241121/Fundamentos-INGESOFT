// src/repositories/ProductRepository.js
const { DatabaseConnection } = require('../config/database');
const Product = require('../models/Product');
const logger = require('../utils/logger');

class ProductRepository {
  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  // Buscar por ID
  async findById(id) {
    try {
      const query = 'SELECT * FROM products WHERE id = $1';
      const rows = await this.db.query(query, [id]);
      if (rows.length === 0) return null;
      return this._mapToProduct(rows[0]);
    } catch (error) {
      logger.error('Error finding product by ID', error);
      throw error;
    }
  }

  // Buscar por texto (nombre / descripción)
  async searchByQuery(queryText) {
    try {
      const query = `
        SELECT * FROM products
        WHERE name ILIKE $1 OR description ILIKE $1
        ORDER BY created_at DESC
        LIMIT 20
      `;
      const rows = await this.db.query(query, [`%${queryText}%`]);
      return rows.map((row) => this._mapToProduct(row));
    } catch (error) {
      logger.error('Error searching products', error);
      throw error;
    }
  }

  // Guardar nuevo producto
  async save(product) {
    try {
      const query = `
        INSERT INTO products (id, name, description, category, external_link, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [
        product.id,
        product.name,
        product.description,
        product.category,
        product.externalLink,
        product.createdAt,
        product.updatedAt,
      ];

      const rows = await this.db.query(query, values);
      return this._mapToProduct(rows[0]);
    } catch (error) {
      logger.error('Error saving product', error);
      throw error;
    }
  }

  // Actualizar producto (por si luego lo necesitas)
  async update(id, product) {
    try {
      const query = `
        UPDATE products
        SET name = $1,
            description = $2,
            category = $3,
            external_link = $4,
            updated_at = $5
        WHERE id = $6
        RETURNING *
      `;
      const values = [
        product.name,
        product.description,
        product.category,
        product.externalLink,
        new Date(),
        id,
      ];

      const rows = await this.db.query(query, values);
      if (rows.length === 0) return null;
      return this._mapToProduct(rows[0]);
    } catch (error) {
      logger.error('Error updating product', error);
      throw error;
    }
  }

  // Mapear row de BD → objeto Product
  _mapToProduct(row) {
    return new Product(
      row.id,
      row.name,
      row.description,
      row.category,
      row.external_link,   // OJO: en BD es external_link
      row.created_at,
      row.updated_at
    );
  }
}

module.exports = ProductRepository;
