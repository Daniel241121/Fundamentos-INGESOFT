// src/scripts/seed-price-history.js
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Cargar el .env desde la raíz del monorepo
dotenv.config({
  path: path.join(__dirname, '..', '..', '..', '.env'),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mismo producto de prueba
const PRODUCT_ID = 'b6d29c9b-565f-4af0-9f2b-4084596af09a';

async function main() {
  const entries = [
    { store: 'Amazon',       price: 999.99, date: '2025-10-10' },
    { store: 'Amazon',       price: 949.99, date: '2025-10-20' },
    { store: 'Amazon',       price: 919.99, date: '2025-11-01' },
    { store: 'Amazon',       price: 899.99, date: '2025-11-08' },

    { store: 'MercadoLibre', price: 980.0,  date: '2025-10-10' },
    { store: 'MercadoLibre', price: 940.0,  date: '2025-10-20' },
    { store: 'MercadoLibre', price: 910.0,  date: '2025-11-01' },
    { store: 'MercadoLibre', price: 895.0,  date: '2025-11-08' },

    { store: 'eBay',         price: 970.0,  date: '2025-10-10' },
    { store: 'eBay',         price: 935.0,  date: '2025-10-20' },
    { store: 'eBay',         price: 905.0,  date: '2025-11-01' },
    { store: 'eBay',         price: 890.0,  date: '2025-11-08' },
  ];

  const rows = entries.map((e) => ({
    product_id: PRODUCT_ID,
    store: e.store,
    price: e.price,
    currency: 'USD',
    created_at: e.date,
  }));

  console.log('➡️ Insertando historial de precios de ejemplo...');

  // Opción 1: no necesitamos data, solo verificar error
  const { error } = await supabase.from('price_history').insert(rows);

  if (error) {
    console.error('❌ Error insertando price_history:', error);
    process.exit(1);
  }

  console.log(`✅ Insertados ${rows.length} registros en price_history`);
  process.exit(0);
}

main();
