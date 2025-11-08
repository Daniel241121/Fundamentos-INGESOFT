const ProductService = require('../services/ProductService');
const ReviewService = require('../services/ReviewService');
const logger = require('../utils/logger');

class ProductController {
  constructor() {
    this.productService = new ProductService();
    this.reviewService = new ReviewService();
  }

  async searchProducts(req, res) {
    try {
      const { query } = req.query;
      if (!query || query.length === 0) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const products = await this.productService.searchProducts(query);
      res.json(products);
    } catch (error) {
      logger.error('Error searching products', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Obtenemos reviews y análisis
      const reviews = await this.reviewService.getReviewsByProduct(id);
      const analysis = await this.reviewService.analyzeReviews(id);

      res.json({
        product,
        reviews,
        analysis,
      });
    } catch (error) {
      logger.error('Error fetching product', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async comparePrice(req, res) {
    try {
      const { productId } = req.params;
      const priceComparison = await this.productService.comparePrice(productId);
      res.json(priceComparison);
    } catch (error) {
      logger.error('Error comparing prices', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, description, category, externalLink } = req.body;
      const productData = { name, description, category, externalLink };
      const product = await this.productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ProductController;
