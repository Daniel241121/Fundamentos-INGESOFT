const logger = require('../utils/logger');

class SentimentAnalysisService {
  constructor() {
    this.sentimentKeywords = {
      POSITIVE: ['excelente', 'fantástico', 'muy bueno', 'perfecto', 'increíble', 'recomiendo', 'satisfecho', 'happy', 'great', 'excellent', 'amazing'],
      NEGATIVE: ['malo', 'terrible', 'pésimo', 'horrible', 'decepcionante', 'no recomiendo', 'defectuoso', 'broken', 'waste', 'horrible', 'disappointed'],
    };
  }

  // Strategy Pattern: Implementar análisis simple (simulado)
  // En producción: usar transformers o APIs de IA
  analyzeSentiment(text) {
    try {
      if (!text || text.length === 0) {
        return 'NEUTRAL';
      }

      const lowerText = text.toLowerCase();
      let positiveCount = 0;
      let negativeCount = 0;

      // Contar palabras positivas
      this.sentimentKeywords.POSITIVE.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          positiveCount++;
        }
      });

      // Contar palabras negativas
      this.sentimentKeywords.NEGATIVE.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          negativeCount++;
        }
      });

      if (positiveCount > negativeCount) {
        return 'POSITIVE';
      } else if (negativeCount > positiveCount) {
        return 'NEGATIVE';
      } else {
        return 'NEUTRAL';
      }
    } catch (error) {
      logger.error('Error analyzing sentiment', error);
      return 'NEUTRAL';
    }
  }

  async analyzeBatch(reviews) {
    try {
      const results = new Map();
      reviews.forEach((review, index) => {
        results.set(index, this.analyzeSentiment(review));
      });
      return results;
    } catch (error) {
      logger.error('Error analyzing batch', error);
      throw error;
    }
  }

  // Patrón Strategy: Interfaz para otros algoritmos
  setStrategy(strategy) {
    this.strategy = strategy;
  }
}

module.exports = SentimentAnalysisService;
