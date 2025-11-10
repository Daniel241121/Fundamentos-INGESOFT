const { Pool } = require('pg');
const logger = require('../utils/logger');

class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) return DatabaseConnection.instance;

    const rawUrl = process.env.DATABASE_URL;

    if (!rawUrl) {
      logger.error('DATABASE_URL no está definido en las variables de entorno');
      throw new Error('DATABASE_URL is required');
    }

    const url = new URL(rawUrl);
    url.searchParams.set('pgbouncer', 'true'); // FORZAR SESSION MODE

    logger.log('Creando Pool de PostgreSQL (session mode)...');
    logger.log('   DATABASE_URL = ' + url.toString());

    this.pool = new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
    });

    this.pool.on('error', (err) => {
      logger.error('Pool error (idle client)', err);
    });

    DatabaseConnection.instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) new DatabaseConnection();
    return DatabaseConnection.instance;
  }

  async query(text, params = []) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      logger.error('Database query error', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  async connectDatabase() {
    await this.query('SELECT NOW()');
    logger.log('Database connection successful');
  }
}

module.exports = { DatabaseConnection };
