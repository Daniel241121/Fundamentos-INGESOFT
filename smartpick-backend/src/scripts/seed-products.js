// src/scripts/seed-products.js
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const products = [
    {
      name: "Samsung Galaxy S24 Ultra",
      description:
        "Smartphone gama alta con cámara avanzada y batería de larga duración.",
      category: "Electronics",
      external_link: "https://www.samsung.com",
    },
    {
      name: "MacBook Air M3",
      description:
        "Portátil ligero con procesador Apple Silicon ideal para estudio y trabajo.",
      category: "Computers",
      external_link: "https://www.apple.com/macbook-air",
    },
    {
      name: "Sony WH-1000XM5",
      description:
        "Audífonos inalámbricos con cancelación de ruido líder en el mercado.",
      category: "Audio",
      external_link: "https://www.sony.com",
    },
    {
      name: "Suero de Bakuchiol",
      description:
        "Producto de cuidado de la piel con bakuchiol, alternativa vegetal al retinol, que reduce manchas y arrugas gracias a sus propiedades antioxidantes.",
      category: "Beauty",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Separadores de Dedos",
      description:
        "Dispositivos que promueven la posición natural de los dedos del pie para aliviar dolores y mejorar el equilibrio.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Suplemento para TDAH",
      description:
        "Suplementos con omega-3, hierro y magnesio para mejorar la atención, memoria y estado de ánimo.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Raqueta de Padel",
      description:
        "Raqueta ligera y sin cuerdas para el deporte de pádel, ideal para juegos en canchas cerradas.",
      category: "Sports & Outdoors",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Chocolate de Hongos",
      description:
        "Chocolates con hongos para impulsar la inmunidad, reducir estrés y mejorar el humor.",
      category: "Food & Beverage",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Gominolas de Remolacha",
      description:
        "Gominolas con extracto de remolacha para beneficios en la salud cardíaca.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Pijamas de Bambú para Bebés",
      description:
        "Ropa de noche orgánica para bebés hecha de fibra de bambú, cómoda y ecológica.",
      category: "Baby & Kids",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Loción Corporal de Niacinamida",
      description:
        "Loción hidratante con vitamina B3 para potenciar la hidratación de la piel.",
      category: "Beauty",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Ropa Interior Desechable para Período",
      description:
        "Ropa interior ecológica que absorbe el flujo menstrual con comodidad y discreción.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Gominolas de Creatina",
      description:
        "Suplementos masticables para aumentar masa muscular y rendimiento en ejercicios.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Gominolas de Cúrcuma",
      description:
        "Dulces masticables con cúrcuma rica en curcumina para reducir inflamación.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Champú de Agua de Arroz",
      description:
        "Champú hecho de agua de arroz filtrada para reparar y proteger el cabello.",
      category: "Beauty",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Café de Hongos",
      description:
        "Mezcla de hongos como melena de león con café instantáneo para enfoque mental.",
      category: "Food & Beverage",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Gominolas de Cafeína",
      description:
        "Suplementos masticables con cafeína vegetal para un impulso de energía diario.",
      category: "Health & Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Suero de Ácido Kójico",
      description:
        "Suero para iluminar el tono de piel y reducir manchas oscuras.",
      category: "Beauty",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Bocados de Salmón para Perros",
      description:
        "Golosinas para perros hechas de salmón ricas en omega-3 para piel y pelaje saludables.",
      category: "Pet Supplies",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Té de Ashwagandha",
      description:
        "Té con extracto de ashwagandha para un consumo conveniente del hierba adaptógena.",
      category: "Food & Beverage",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Máscara para Ojos de Viaje y Sueño",
      description:
        "Máscara cómoda para bloquear la luz durante viajes o sueño reparador.",
      category: "Health and Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Calentador de Toallas para Baño",
      description:
        "Dispositivo que calienta toallas para una experiencia de baño lujosa.",
      category: "Home & Kitchen",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Pasta Dental Blanqueadora",
      description:
        "Pasta dental para blanquear dientes y mantener una sonrisa radiante.",
      category: "Beauty and Skincare",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Spa de Pies Burbujeante para Hogar",
      description:
        "Dispositivo de spa para pies con burbujas para relajación en casa.",
      category: "Health and Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Masajeador de Piernas con Calor y Compresión",
      description:
        "Masajeador terapéutico para piernas con calor para alivio muscular.",
      category: "Health and Wellness",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Calendario de Aventuras de Belleza",
      description:
        "Calendario estacional con productos de belleza sorpresa para cada día.",
      category: "Beauty and Skincare",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Bálsamo para Ojos contra Ojeras",
      description:
        "Bálsamo de cuidado de piel para reducir ojeras y revitalizar la mirada.",
      category: "Beauty and Skincare",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Esponjas Faciales",
      description:
        "Herramientas para rutinas de cuidado facial suave y efectiva.",
      category: "Beauty and Skincare",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Cepillo Alisador de Cabello",
      description:
        "Herramienta de peinado que alisa el cabello mientras lo cepilla.",
      category: "Beauty and Skincare",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Bálsamo Limpiador",
      description:
        "Bálsamo para limpiar la piel suavemente y eliminar impurezas.",
      category: "Beauty and Skincare",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Banco de Energía",
      description:
        "Dispositivo portátil para cargar teléfonos y gadgets en movimiento.",
      category: "Tech Gadgets and Accessories",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Altavoz Bluetooth",
      description:
        "Altavoz inalámbrico para audio de alta calidad en cualquier lugar.",
      category: "Tech Gadgets and Accessories",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Calentador de Taza de Café",
      description:
        "Dispositivo para mantener bebidas calientes durante horas.",
      category: "Tech Gadgets and Accessories",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Estación de Acoplamiento para Teléfono",
      description:
        "Estación para cargar y sincronizar múltiples dispositivos.",
      category: "Tech Gadgets and Accessories",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Proyector de Películas",
      description:
        "Proyector para entretenimiento casero con imágenes nítidas.",
      category: "Tech Gadgets and Accessories",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Masticables Probióticos para Mascotas",
      description:
        "Suplementos probióticos en forma de masticables para la salud digestiva de mascotas.",
      category: "Pet Products",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Caja de Arena Automática para Gatos",
      description:
        "Caja de arena autolimpiable para comodidad y higiene felina.",
      category: "Pet Products",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Escaleras o Rampa para Cama de Mascotas",
      description:
        "Ayudas de movilidad para mascotas mayores o con problemas articulares.",
      category: "Pet Products",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Fuente de Agua para Gatos",
      description:
        "Fuente que mantiene el agua fresca para incentivar el consumo en gatos.",
      category: "Pet Products",
      external_link: "https://www.amazon.com",
    },
    {
      name: "Paseador de Mascotas",
      description:
        "Carriola portátil para transportar mascotas pequeñas de forma segura.",
      category: "Pet Products",
      external_link: "https://www.amazon.com",
    }
  ];

  console.log("➡️ Insertando productos de ejemplo...");
  const { data, error } = await supabase
    .from("products")
    .insert(products)
    .select("id, name");
  if (error) {
    console.error("❌ Error insertando productos:", error);
    process.exit(1);
  }
  console.log("✅ Productos insertados:");
  data.forEach((p) => {
    console.log(`- ${p.name}: ${p.id}`);
  });
  console.log(
    "👉 Copia estos IDs para usarlos como productos destacados en el frontend."
  );
  process.exit(0);
}

main();