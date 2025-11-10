// src/controllers/ProductController.js
const supabase = require('../../db');
const logger = require('../utils/logger');

class ProductController {
  constructor() {
    // Ya NO usamos DatabaseConnection aquí
  }

  // Buscar productos por query (nombre, descripción o enlace)
  async searchProducts(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        return res
          .status(400)
          .json({ error: 'Query parameter is required' });
      }

      const pattern = `%${query}%`;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(
          `name.ilike.${pattern},description.ilike.${pattern},external_link.ilike.${pattern}`
        )
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        logger.error('Error searching products', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.json(data);
    } catch (err) {
      logger.error('Error searching products (catch)', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Obtener producto por ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching product by ID', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json(data);
    } catch (err) {
      logger.error('Error fetching product by ID (catch)', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Crear producto
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

      const { data, error } = await supabase
        .from('products')
        .insert({
          name,
          description: description || null,
          category: category || null,
          external_link: externalLink || null,
        })
        .select()
        .single();

      if (error) {
        logger.error('❌ [createProduct] Error creando producto', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      logger.log(`✅ Product created: ${data.id}`);

      return res.status(201).json({
        message: 'Product created successfully',
        product: data,
      });
    } catch (err) {
      logger.error('❌ [createProduct] Error creando producto (catch)', err);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      logger.log(`ℹ️ [createProduct] Total time: ${Date.now() - start} ms`);
    }
  }

  // ==========
  // HU1 - Resumen de producto (ratings + reseñas)
  // Usamos directamente review_analytics para que coincida con /review-analytics
 // En src/controllers/ProductController.js
// Reemplaza COMPLETA la función getProductSummary por esta:

  // Resumen de producto (HU1) - ratings + reseñas
  async getProductSummary(req, res) {
    try {
      const { id } = req.params;

      // 1) Asegurarnos de que el producto exista
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', id)
        .maybeSingle();

      if (productError) {
        logger.error('Error fetching product in getProductSummary', productError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // 2) Traer analítica desde review_analytics (puede NO existir)
      const { data: analyticsRow, error: analyticsError } = await supabase
        .from('review_analytics')
        .select(
          'total_reviews, average_rating, positive_count, neutral_count, negative_count'
        )
        .eq('product_id', id)
        .maybeSingle();

      if (analyticsError) {
        logger.error(
          'Error fetching review_analytics for summary',
          analyticsError
        );
        return res.status(500).json({ error: 'Internal server error' });
      }

      const total = analyticsRow?.total_reviews || 0;
      const avg = Number(analyticsRow?.average_rating || 0);
      const pos = analyticsRow?.positive_count || 0;
      const neu = analyticsRow?.neutral_count || 0;
      const neg = analyticsRow?.negative_count || 0;

      // 3) Obtener algunas reseñas recientes (si las hay)
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(
          'id, rating, sentiment, source, content, is_verified, created_at'
        )
        .eq('product_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsError) {
        logger.error('Error fetching reviews for summary', reviewsError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // 4) Mensaje "inteligente" según distribución
      let highlight;
      if (total === 0) {
        highlight =
          'Este producto aún no tiene reseñas registradas en el sistema.';
      } else if (pos > neg * 2) {
        highlight =
          'La mayoría de los usuarios tiene una opinión muy positiva sobre este producto, destacando su calidad y rendimiento general.';
      } else if (neg > pos) {
        highlight =
          'Se observan varias reseñas negativas. Algunos usuarios reportan problemas que podrían afectar la experiencia de uso.';
      } else {
        highlight =
          'Las opiniones están balanceadas: hay comentarios positivos y negativos, por lo que vale la pena revisar los detalles de las reseñas.';
      }

      return res.json({
        product: {
          id: product.id,
          name: product.name,
        },
        summary: {
          average_rating: avg,
          total_reviews: total,
          positive_count: pos,
          neutral_count: neu,
          negative_count: neg,
          highlight,
        },
        reviews: reviews || [],
      });
    } catch (err) {
      logger.error('Error building product summary', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }


    // Analítica pura para gráficas (review_analytics)
    async getReviewAnalytics(req, res) {
      try {
        const { id } = req.params;
  
        const { data, error } = await supabase
          .from('review_analytics')
          .select(
            'product_id, total_reviews, average_rating, positive_count, neutral_count, negative_count, last_updated'
          )
          .eq('product_id', id)
          .maybeSingle();
  
        if (error) {
          logger.error('Error fetching review_analytics', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        // ⚠️ Si no hay fila en review_analytics, devolvemos todo en 0
        if (!data) {
          return res.json({
            product_id: id,
            total_reviews: 0,
            average_rating: 0,
            positive_count: 0,
            neutral_count: 0,
            negative_count: 0,
            last_updated: null,
          });
        }
  
        return res.json(data);
      } catch (err) {
        logger.error('Error in getReviewAnalytics', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  

  // Historial de precios para HU2/HU4 (gráficas)
  async getPriceHistory(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('price_history')
        .select('store, price, currency, created_at')
        .eq('product_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        logger.error('Error fetching price_history', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.json({
        product_id: id,
        points: data || [],
      });
    } catch (err) {
      logger.error('Error in getPriceHistory', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Comparación de precios actual (HU2)
  async getPriceComparison(req, res) {
    try {
      const { id } = req.params;
      const sort = req.query.sort || 'price_asc'; // price_asc | price_desc

      const { data, error } = await supabase
        .from('price_history')
        .select('store, price, currency, created_at')
        .eq('product_id', id)
        .order('created_at', { ascending: false }); // primero los más recientes

      if (error) {
        logger.error(
          'Error fetching price_history for comparison',
          error
        );
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!data || data.length === 0) {
        return res.json({
          product_id: id,
          stores: [],
          cheapest: null,
          most_expensive: null,
          difference_to_most_expensive: 0,
        });
      }

      // Último precio por tienda
      const latestByStore = {};
      for (const row of data) {
        if (!latestByStore[row.store]) {
          latestByStore[row.store] = row;
        }
      }

      let stores = Object.values(latestByStore);

      if (stores.length === 0) {
        return res.json({
          product_id: id,
          stores: [],
          cheapest: null,
          most_expensive: null,
          difference_to_most_expensive: 0,
        });
      }

      // Ordenar según query
      if (sort === 'price_desc') {
        stores.sort((a, b) => b.price - a.price);
      } else {
        stores.sort((a, b) => a.price - b.price);
      }

      const cheapest = stores.reduce(
        (min, s) => (s.price < min.price ? s : min),
        stores[0]
      );
      const mostExpensive = stores.reduce(
        (max, s) => (s.price > max.price ? s : max),
        stores[0]
      );

      const difference =
        mostExpensive && cheapest
          ? Number((mostExpensive.price - cheapest.price).toFixed(2))
          : 0;

      return res.json({
        product_id: id,
        stores: stores.map((s) => ({
          store: s.store,
          price: s.price,
          currency: s.currency,
          last_updated: s.created_at,
        })),
        cheapest: {
          store: cheapest.store,
          price: cheapest.price,
          currency: cheapest.currency,
          last_updated: cheapest.created_at,
        },
        most_expensive: {
          store: mostExpensive.store,
          price: mostExpensive.price,
          currency: mostExpensive.currency,
          last_updated: mostExpensive.created_at,
        },
        difference_to_most_expensive: difference,
      });
    } catch (err) {
      logger.error('Error in getPriceComparison', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Listar reseñas con filtro por sentimiento (HU3)
  async listReviews(req, res) {
    try {
      const { id } = req.params;
      const { sentiment } = req.query; // POSITIVE | NEUTRAL | NEGATIVE

      let query = supabase
        .from('reviews')
        .select(
          'id, rating, sentiment, source, content, is_verified, created_at'
        )
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (sentiment) {
        const upper = sentiment.toUpperCase();
        const allowed = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
        if (allowed.includes(upper)) {
          query = query.eq('sentiment', upper);
        }
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching reviews with filter', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.json({
        product_id: id,
        sentiment: sentiment || 'ALL',
        reviews: data || [],
      });
    } catch (err) {
      logger.error('Error in listReviews', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Crear reseña para un producto (POST /api/products/:id/reviews)
  async createReview(req, res) {
    try {
      const { id: productId } = req.params;
      const user = req.user;

      if (!user || !user.id) {
        return res
          .status(401)
          .json({ error: 'User not authenticated' });
      }

      const { rating, content, sentiment, source, isVerified } = req.body;

      // Validaciones básicas
      if (!rating || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: 'Rating must be between 1 and 5' });
      }

      if (!content || content.trim().length < 5) {
        return res.status(400).json({
          error: 'Content must have at least 5 characters',
        });
      }

      // Sentiment opcional: si no viene, lo dejamos en NEUTRAL
      let finalSentiment = 'NEUTRAL';
      if (sentiment) {
        const upper = sentiment.toUpperCase();
        const allowed = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
        if (!allowed.includes(upper)) {
          return res.status(400).json({
            error:
              'Invalid sentiment. Use POSITIVE, NEUTRAL or NEGATIVE',
          });
        }
        finalSentiment = upper;
      }

      const reviewRow = {
        product_id: productId,
        user_id: user.id,
        rating,
        content,
        sentiment: finalSentiment,
        source: source || 'Manual',
        is_verified: isVerified === true,
      };

      // Insertar reseña
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewRow)
        .select(
          'id, product_id, user_id, rating, sentiment, source, content, is_verified, created_at'
        )
        .single();

      if (error) {
        logger.error('Error inserting review', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Refrescar analytics del producto
      const { error: rpcError } = await supabase.rpc(
        'refresh_product_analytics',
        { p_product_id: productId }
      );

      if (rpcError) {
        logger.error('Error refreshing product analytics', rpcError);
        // No frenamos por esto: la reseña ya se creó
      }

      return res.status(201).json({
        message: 'Review created successfully',
        review: data,
      });
    } catch (err) {
      logger.error('Error in createReview', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ProductController;
