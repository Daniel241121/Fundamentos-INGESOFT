// src/config/database.js
const { Pool } = require("pg");
const logger = require("../utils/logger");
require("dotenv").config();

class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    console.log("📦 Creando Pool de PostgreSQL...");
    console.log("   DATABASE_URL =", process.env.DATABASE_URL);

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // necesario para Supabase
      },
    });

    this.pool.on("error", (err) => {
      logger.error("Unexpected error on idle client", err);
    });

    DatabaseConnection.instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async query(text, params = []) {
    try {
      const result = await this.pool.query(text, params);
      return result.rows;
    } catch (error) {
      logger.error("Database query error", error);
      throw error;
    }
  }

  async connectDatabase() {
    try {
      const result = await this.pool.query("SELECT NOW()");
      logger.log("Database connection successful");
      return result;
    } catch (error) {
      logger.error("Database connection failed", error);
      throw error;
    }
  }
}

const connectDatabase = async () => {
  const db = DatabaseConnection.getInstance();
  await db.connectDatabase();
};

module.exports = { DatabaseConnection, connectDatabase };
