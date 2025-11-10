// src/services/ProductService.js
const { DatabaseConnection } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class ProductService {
  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async createProduct({ name, description, category, externalLink }) {
    if (!name) {
      throw new Error('Product name is required');
    }

    const id = uuidv4();

    const query = `
      INSERT INTO products (id, name, description, category, external_link)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      id,
      name,
      description || null,
      category || null,
      externalLink || null,
    ];

    const rows = await this.db.query(query, values);
    const product = rows[0];

    logger.log(`Product created in DB: ${product.id}`);

    return product;
  }
}

module.exports = ProductService;
