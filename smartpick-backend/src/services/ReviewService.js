// src/services/ReviewService.js
const { DatabaseConnection } = require('../config/database');
const logger = require('../utils/logger');

class ReviewService {
  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  // Obtener reseñas de un producto
  async getReviewsByProduct(productId) {
    try {
      const sql = `
        SELECT id, product_id, user_id, content, rating, sentiment,
               source, is_verified, created_at, updated_at
        FROM reviews
        WHERE product_id = $1
        ORDER BY created_at DESC;
      `;

      const rows = await this.db.query(sql, [productId]);
      return rows;
    } catch (error) {
      logger.error('Error in ReviewService.getReviewsByProduct', error);
      throw error;
    }
  }

  // Analítica de reseñas de un producto
  async analyzeReviews(productId) {
    try {
      const sql = `
        SELECT
          COUNT(*)::int AS total_reviews,
          COALESCE(AVG(rating), 0)::float AS average_rating,
          COUNT(CASE WHEN sentiment = 'POSITIVE' THEN 1 END)::int AS positive_count,
          COUNT(CASE WHEN sentiment = 'NEUTRAL'  THEN 1 END)::int AS neutral_count,
          COUNT(CASE WHEN sentiment = 'NEGATIVE' THEN 1 END)::int AS negative_count
        FROM reviews
        WHERE product_id = $1;
      `;

      const rows = await this.db.query(sql, [productId]);
      return rows[0] || {
        total_reviews: 0,
        average_rating: 0,
        positive_count: 0,
        neutral_count: 0,
        negative_count: 0,
      };
    } catch (error) {
      logger.error('Error in ReviewService.analyzeReviews', error);
      throw error;
    }
  }
}

module.exports = ReviewService;
