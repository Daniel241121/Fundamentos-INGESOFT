// server.js
const app = require('./src/app');
const logger = require('./src/utils/logger');
const supabase = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Probar conexión a Supabase (consulta ligera)
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    logger.log('Supabase connection successful');

    app.listen(PORT, () => {
      logger.log(`SmartPick API running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
