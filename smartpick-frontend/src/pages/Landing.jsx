// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// 👇 Productos destacados (IDs reales de tu BD + el iPhone demo)
const FEATURED_PRODUCTS = [
  {
    id: "b6d29c9b-565f-4af0-9f2b-4084596af09a",
    name: "iPhone 16 Pro",
    category: "Electronics",
    highlight:
      "Smartphone demo con reseñas y comparación de precios para probar todas las funciones de SmartPick.",
    priceHint: "Desde ~890 USD",
    tag: "Demo completo",
  },
  {
    id: "25117acd-fe71-4fb5-88b4-f6ddffd7ec85",
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    highlight:
      "Gama alta Android con cámara avanzada y batería de larga duración.",
    priceHint: "Desde ~1,025 USD",
    tag: "Top ventas",
  },
  {
    id: "9a593f8f-da44-4a14-9758-b74f8f418665",
    name: "MacBook Air M3",
    category: "Computers",
    highlight:
      "Portátil ligero con chip Apple Silicon, ideal para estudio y trabajo remoto.",
    priceHint: "Desde ~1,129 USD",
    tag: "Ideal estudio",
  },
  {
    id: "21c8b255-2faf-46e2-b6c4-65f002cfe42e",
    name: "Sony WH-1000XM5",
    category: "Audio",
    highlight:
      "Auriculares inalámbricos con cancelación de ruido líder en el mercado.",
    priceHint: "Desde ~329 USD",
    tag: "Audio premium",
  },
  {
    id: "fa2ea5ed-4bb6-4687-99e8-161a27a0423c",
    name: "Suero de Bakuchiol",
    category: "Beauty",
    highlight:
      "Alternativa vegetal al retinol para reducir manchas y arrugas.",
    priceHint: "Desde ~22 USD",
    tag: "Skincare",
  },
  {
    id: "6e766356-d384-4bf5-a27b-181b26711b36",
    name: "Pijamas de Bambú para Bebés",
    category: "Baby & Kids",
    highlight:
      "Pijamas orgánicas de fibra de bambú, suaves y ecológicas para los más pequeños.",
    priceHint: "Desde ~24 USD",
    tag: "Bebés",
  },
  {
    id: "dd9ea5ce-c90d-422f-9929-9a85bd1fc617",
    name: "Caja de Arena Automática para Gatos",
    category: "Pet Products",
    highlight:
      "Caja de arena autolimpiable para mantener la casa más limpia y sin olores.",
    priceHint: "Desde ~189 USD",
    tag: "Gatos",
  },
  {
    id: "ecaf596b-860e-4bce-8371-e9e8febcb76d",
    name: "Paseador de Mascotas",
    category: "Pet Products",
    highlight:
      "Carriola portátil para transportar mascotas pequeñas con comodidad.",
    priceHint: "Desde ~58 USD",
    tag: "Mascotas",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
  }

  function handleQuickCategory(text) {
    setQuery(text);
    navigate(`/search?query=${encodeURIComponent(text)}`);
  }

  return (
    <div className="page landing-page">
      {/* HEADER */}
      <header className="landing-header">
        <div className="logo" onClick={() => navigate("/")}>
          SMARTPICK
        </div>

        <nav className="landing-nav">
          <button
            className="btn ghost small"
            onClick={() => navigate("/search")}
          >
            Explorar
          </button>
          <button
            className="btn ghost small"
            onClick={() => navigate("/add-product")}
          >
            Agregar producto
          </button>
          <button
            className="btn ghost small"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
          <button
            className="btn small"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </button>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="landing-main">
        {/* HERO tipo MercadoLibre */}
        <section className="landing-hero">
          <h1 className="landing-title">
            Compara precios y reseñas como en MercadoLibre,
            <br />
            pero en una sola pantalla.
          </h1>
          <p className="landing-subtitle">
            SmartPick junta opiniones reales y precios de tiendas como Amazon,
            MercadoLibre y eBay para ayudarte a elegir mejor sin abrir mil
            pestañas.
          </p>

          <form className="landing-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder='Busca un producto, por ejemplo "Galaxy", "creatina", "gatos"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn" type="submit">
              Buscar
            </button>
          </form>

          <div className="landing-quick-filters">
            <span className="muted">Búsquedas rápidas:</span>
            <button
              type="button"
              className="chip clickable"
              onClick={() => handleQuickCategory("Galaxy")}
            >
              Smartphones
            </button>
            <button
              type="button"
              className="chip clickable"
              onClick={() => handleQuickCategory("creatina")}
            >
              Suplementos
            </button>
            <button
              type="button"
              className="chip clickable"
              onClick={() => handleQuickCategory("gatos")}
            >
              Mascotas
            </button>
            <button
              type="button"
              className="chip clickable"
              onClick={() => handleQuickCategory("proyector")}
            >
              Tecnología
            </button>
          </div>

          <p className="landing-caption">
            Puedes usar la búsqueda sin cuenta. Para publicar reseñas y agregar
            productos, regístrate gratis.
          </p>
        </section>

        {/* GRID DE PRODUCTOS DESTACADOS */}
        <section className="landing-featured">
          <div className="landing-featured-header">
            <h2>Productos destacados</h2>
            <p className="muted">
              Datos de ejemplo ya cargados en tu base. Haz clic en
              &nbsp;
              <strong>“Ver análisis”</strong> para abrir la ficha tipo
              SmartPick.
            </p>
          </div>

          <div className="featured-grid">
            {FEATURED_PRODUCTS.map((p) => (
              <article key={p.id} className="featured-card">
                <header className="featured-card-header">
                  <div>
                    <h3>{p.name}</h3>
                    <p className="featured-category">{p.category}</p>
                  </div>
                  {p.tag && <span className="chip">{p.tag}</span>}
                </header>

                <p className="featured-description">{p.highlight}</p>

                <div className="featured-meta">
                  <span className="muted">
                    Amazon · MercadoLibre · eBay
                  </span>
                  {p.priceHint && (
                    <span className="price-hint">{p.priceHint}</span>
                  )}
                </div>

                <button
                  className="btn secondary full-width"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  Ver análisis
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
