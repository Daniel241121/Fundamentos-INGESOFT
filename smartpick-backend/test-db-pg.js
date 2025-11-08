// test-db-pg.js
const { connectDatabase } = require('./src/config/database');

(async () => {
  try {
    console.log('🚀 Probando conexión con pg + DATABASE_URL...');
    await connectDatabase();
    console.log('✅ Conexión OK (SELECT NOW() exitoso)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error conectando a la base:', err.message);
    process.exit(1);
  }
})();
