// src/scripts/seed-reviews.js
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

// IDs a ajustar si cambian
const PRODUCT_ID = 'b6d29c9b-565f-4af0-9f2b-4084596af09a';
const USER_ID = '32a0b3f8-4486-45e2-ba96-1db050945520';

async function main() {
  const reviews = [
    {
      product_id: PRODUCT_ID,
      user_id: USER_ID,
      rating: 5,
      sentiment: 'POSITIVE',
      source: 'Amazon',
      content: 'La batería dura todo el día y la cámara es excelente.',
      is_verified: true,
    },
    {
      product_id: PRODUCT_ID,
      user_id: USER_ID,
      rating: 4,
      sentiment: 'POSITIVE',
      source: 'MercadoLibre',
      content:
        'Muy buen rendimiento, aunque se calienta un poco con juegos pesados.',
      is_verified: true,
    },
    {
      product_id: PRODUCT_ID,
      user_id: USER_ID,
      rating: 3,
      sentiment: 'NEUTRAL',
      source: 'Amazon',
      content: 'Buen teléfono, pero esperaba más por el precio.',
      is_verified: false,
    },
    {
      product_id: PRODUCT_ID,
      user_id: USER_ID,
      rating: 2,
      sentiment: 'NEGATIVE',
      source: 'eBay',
      content: 'La batería no me dura tanto como prometen.',
      is_verified: false,
    },
    {
      product_id: PRODUCT_ID,
      user_id: USER_ID,
      rating: 5,
      sentiment: 'POSITIVE',
      source: 'Amazon',
      content: 'La pantalla se ve increíble y el diseño es muy premium.',
      is_verified: true,
    },
    // 👉 Si quieres llegar a 20 reseñas, duplica y varía estos registros
  ];

  console.log('➡️ Insertando reseñas de ejemplo...');
  const { error: insertError } = await supabase.from('reviews').insert(reviews);

  if (insertError) {
    console.error('❌ Error insertando reseñas:', insertError);
    process.exit(1);
  }

  console.log('✅ Reseñas insertadas. Recalculando analytics...');

  const { error: rpcError } = await supabase.rpc('refresh_product_analytics', {
    p_product_id: PRODUCT_ID,
  });

  if (rpcError) {
    console.error('❌ Error ejecutando refresh_product_analytics:', rpcError);
    process.exit(1);
  }

  console.log('✅ review_analytics actualizado para el producto:', PRODUCT_ID);
  process.exit(0);
}

main();
