// src/scripts/seed-analytics-multi.js
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// ===== CARGAR .env DESDE LA RAÍZ =====
dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ID de usuario (usa uno real de tu tabla users)
const USER_ID = '32a0b3f8-4486-45e2-ba96-1db050945520';

// ===== IDs de tus 40 productos =====
const PRODUCTS = {
  SAMSUNG_GALAXY_S24_ULTRA: '25117acd-fe71-4fb5-88b4-f6ddffd7ec85',
  MACBOOK_AIR_M3: '9a593f8f-da44-4a14-9758-b74f8f418665',
  SONY_WH_1000XM5: '21c8b255-2faf-46e2-b6c4-65f002cfe42e',
  SUERO_BAKUCHIOL: 'fa2ea5ed-4bb6-4687-99e8-161a27a0423c',
  SEPARADORES_DEDOS: '35591f7b-8140-4a95-a2af-eab1633c4875',
  SUPLEMENTO_TDAH: 'e48f868b-095f-43ea-be8c-c4100f812e6f',
  RAQUETA_PADEL: '6f185f6e-500d-45fa-a977-a9fbf67ba742',
  CHOCOLATE_HONGOS: '21db3f16-f404-442a-b659-f4de95f438de',
  GOMINOLAS_REMOLACHA: '2f574c17-3bc2-448f-a15c-977e60107609',
  PIJAMAS_BAMBU_BEBE: '6e766356-d384-4bf5-a27b-181b26711b36',
  LOCION_NIACINAMIDA: '28502e80-e568-4651-bea5-39bb2369fbe2',
  ROPA_INTERIOR_DESECHABLE: '7c221900-48ff-4dfe-b165-435412c314b8',
  GOMINOLAS_CREATINA: '84b1b224-ea98-43b8-bdc3-3b27f43c98d2',
  GOMINOLAS_CURCUMA: '3c884bb6-fe75-4663-b19c-9620bf6ffc2d',
  CHAMPU_AGUA_ARROZ: '630735bd-7673-4e87-b7d8-efe2cb6488a1',
  CAFE_HONGOS: 'c5e5e41d-d784-4c4e-bc31-fd366bb49be7',
  GOMINOLAS_CAFEINA: '849a58ed-6308-4d6c-975f-4a0e9d31249f',
  SUERO_ACIDO_KOJICO: 'ca6679cd-d4bf-4c14-8cd2-2bc26e7f048e',
  BOCADOS_SALMON_PERROS: '06d66300-0096-4846-8142-1f4cceb3f885',
  TE_ASHWAGANDHA: 'e19ecfb6-3c39-4146-953e-ab0e0bcdfcaf',
  MASCARA_OJOS_VIAJE: 'b8093984-4434-4aeb-8f1f-1d006747c91b',
  CALENTADOR_TOALLAS: '923231de-472e-4771-a256-5dbb478200b9',
  PASTA_DENTAL_BLANQUEADORA: 'a5b5593e-1801-455e-a062-b153423cd575',
  SPA_PIES_BURBUJAS: '88a47bc5-6419-4061-9a45-785e0d2ec9aa',
  MASAJEADOR_PIERNA_CALOR: '0e639ebe-d91c-441f-b18d-a8c3e406bdc5',
  CALENDARIO_BELLEZA: '0f2e535a-f803-4d47-bfda-0b55de75c5b3',
  BALSAMO_OJERAS: '075bce2d-11f0-42b7-9f11-fb35af321ddf',
  ESPONJAS_FACIALES: 'ccf9b7e7-26dd-447d-a7d3-c187ab01233d',
  CEPILLO_ALISADOR_CABELLO: 'e03a1846-61b8-414f-989a-5e433a8f13fa',
  BALSAMO_LIMPIADOR: '8cf51bfa-ce59-45ec-b360-92a952f26495',
  BANCO_ENERGIA: '16cff545-6fea-4c3f-9ee1-2ec67e1e9ae8',
  ALTAVOZ_BLUETOOTH: 'f688668d-4e87-44f3-b13d-66e56305f44d',
  CALENTADOR_TAZA_CAFE: '2cbe2860-fdbc-451c-b84b-77a724bd8378',
  ESTACION_ACOPLAMIENTO: 'b2578192-1afd-4fc1-8d82-34134c060c5c',
  PROYECTOR_PELICULAS: 'e54d7976-fc8b-4959-926c-34de19e866f0',
  MASTICABLES_PROBIOTICOS: 'b9fc3f2c-344d-422c-be05-bee362ed2162',
  CAJA_ARENA_AUTOMATICA: 'dd9ea5ce-c90d-422f-9929-9a85bd1fc617',
  RAMPA_MASCOTAS: '1116e149-8cb6-4e7e-a9ad-6d3e378932c1',
  FUENTE_AGUA_GATOS: 'c8166422-4bf0-46a0-b66e-413f045db3c1',
  PASEADOR_MASCOTAS: 'ecaf596b-860e-4bce-8371-e9e8febcb76d',
};

// ===== PLANTILLAS DE RESEÑAS =====
const REVIEW_TEMPLATES = {
  Electronics: [
    { rating: 5, sentiment: 'POSITIVE', content: 'Excelente rendimiento, batería dura todo el día.' },
    { rating: 4, sentiment: 'POSITIVE', content: 'Muy rápido, ideal para gaming y trabajo.' },
    { rating: 3, sentiment: 'NEUTRAL', content: 'Funciona bien, pero el precio es alto.' },
    { rating: 2, sentiment: 'NEGATIVE', content: 'Se calienta mucho al usar apps pesadas.' },
    { rating: 5, sentiment: 'POSITIVE', content: 'La cámara es increíble, fotos nocturnas perfectas.' },
    { rating: 1, sentiment: 'NEGATIVE', content: 'Llegó con defecto en la pantalla.' },
  ],
  Beauty: [
    { rating: 5, sentiment: 'POSITIVE', content: 'Mi piel nunca estuvo tan hidratada.' },
    { rating: 4, sentiment: 'POSITIVE', content: 'Reduce manchas visiblemente en 2 semanas.' },
    { rating: 3, sentiment: 'NEUTRAL', content: 'Huele bien, pero no veo gran diferencia.' },
    { rating: 2, sentiment: 'NEGATIVE', content: 'Me causó irritación en la piel.' },
    { rating: 5, sentiment: 'POSITIVE', content: 'Textura ligera, se absorbe rápido.' },
    { rating: 1, sentiment: 'NEGATIVE', content: 'El envase llegó roto y derramado.' },
  ],
  'Health & Wellness': [
    { rating: 5, sentiment: 'POSITIVE', content: 'Noté más energía desde el primer día.' },
    { rating: 4, sentiment: 'POSITIVE', content: 'Me ayuda a dormir mejor por las noches.' },
    { rating: 3, sentiment: 'NEUTRAL', content: 'Sabe bien, pero aún no veo efectos.' },
    { rating: 2, sentiment: 'NEGATIVE', content: 'No sentí ningún cambio tras un mes.' },
    { rating: 5, sentiment: 'POSITIVE', content: 'Natural y sin efectos secundarios.' },
  ],
  'Pet Supplies': [
    { rating: 5, sentiment: 'POSITIVE', content: 'Mi perro lo ama, come con ganas.' },
    { rating: 4, sentiment: 'POSITIVE', content: 'Mejoró su pelaje en pocas semanas.' },
    { rating: 3, sentiment: 'NEUTRAL', content: 'Le gusta, pero come lento.' },
    { rating: 2, sentiment: 'NEGATIVE', content: 'Mi gato lo rechazó por completo.' },
    { rating: 5, sentiment: 'POSITIVE', content: 'Ingredientes naturales, sin químicos.' },
  ],
  'Home & Kitchen': [
    { rating: 5, sentiment: 'POSITIVE', content: 'Funciona perfecto, mantiene el café caliente.' },
    { rating: 4, sentiment: 'POSITIVE', content: 'Diseño elegante, fácil de usar.' },
    { rating: 3, sentiment: 'NEUTRAL', content: 'Cumple, pero esperaba más potencia.' },
    { rating: 2, sentiment: 'NEGATIVE', content: 'Dejó de funcionar tras 3 usos.' },
  ],
};

const SOURCES = ['Amazon', 'MercadoLibre', 'eBay'];

// Generar reseñas para un producto
function generateReviews(productId, category) {
  const templates = REVIEW_TEMPLATES[category] || REVIEW_TEMPLATES.Electronics;
  const reviews = [];
  const numReviews = Math.floor(Math.random() * 8) + 8; // 8 a 15 reseñas

  for (let i = 0; i < numReviews; i++) {
    const template = templates[i % templates.length];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    reviews.push({
      product_id: productId,
      user_id: USER_ID,
      rating: template.rating,
      sentiment: template.sentiment,
      source,
      content: template.content,
      is_verified: Math.random() > 0.3,
    });
  }
  return reviews;
}

function inferCategoryFromKey(key) {
  if (key.includes('SUERO') || key.includes('LOCION') || key.includes('CHAMPU') || key.includes('BALSAMO')) {
    return 'Beauty';
  }
  if (key.includes('SUPLEMENTO') || key.includes('GOMINOLAS') || key.includes('TE_ASHWAGANDHA')) {
    return 'Health & Wellness';
  }
  if (key.includes('PERROS') || key.includes('GATOS') || key.includes('MASCOTAS') || key.includes('CAJA_ARENA')) {
    return 'Pet Supplies';
  }
  if (key.includes('CALENTADOR') || key.includes('SPA') || key.includes('PROYECTOR')) {
    return 'Home & Kitchen';
  }
  return 'Electronics';
}

async function main() {
  console.log('🚀 Iniciando seed-analytics-multi...');
  let totalReviews = 0;

  for (const [key, productId] of Object.entries(PRODUCTS)) {
    const category = inferCategoryFromKey(key);

    const reviews = generateReviews(productId, category);
    console.log(
      `➡️ Insertando ${reviews.length} reseñas para ${key} (${category}) [${productId}]`
    );

    const { error: insertError } = await supabase.from('reviews').insert(reviews);
    if (insertError) {
      console.error(`❌ Error insertando reseñas para ${key}:`, insertError.message || insertError);
      process.exit(1);
    }

    totalReviews += reviews.length;

    const { error: rpcError } = await supabase.rpc('refresh_product_analytics', {
      p_product_id: productId,
    });

    if (rpcError) {
      console.warn(
        `⚠️ Advertencia: No se pudo actualizar analytics para ${key} (${productId}):`,
        rpcError.message || rpcError
      );
    } else {
      console.log(`✅ Analytics refrescados para ${key}`);
    }
  }

  console.log('🎉 Seed completado.');
  console.log(`Total reseñas insertadas: ${totalReviews}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error inesperado en seed-analytics-multi:', err);
  process.exit(1);
});
