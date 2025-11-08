// test-env.js
require('dotenv').config();

console.log('🔍 Probando variables de entorno...');
console.log('DATABASE_URL =>', process.env.DATABASE_URL);
console.log('PORT         =>', process.env.PORT);
console.log('NODE_ENV     =>', process.env.NODE_ENV);
console.log('JWT_SECRET   =>', process.env.JWT_SECRET);
