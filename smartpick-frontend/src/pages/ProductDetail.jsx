// src/pages/ProductDetail.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getProductSummary,
  getReviewAnalytics,
  getPriceHistory,
  getPriceComparison,
  getProductReviews,
  createReview,
  logout,
} from "../api/smartpick";
import { getAuthToken } from "../api/client";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString();
}

function renderStars(avg) {
  const value = typeof avg === "number" ? avg : 0;
  const rounded = Math.round(value);
  return "★★★★★"
    .split("")
    .map((s, i) => (i < rounded ? "★" : "☆"))
    .join("");
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [summary, setSummary] = useState(null);        // ← SOLO las stats
  const [analytics, setAnalytics] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formulario de nueva reseña
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState("POSITIVE");
  const [source, setSource] = useState("Manual");
  const [isVerified, setIsVerified] = useState(true);
  const [creatingReview, setCreatingReview] = useState(false);
  const [createError, setCreateError] = useState(null);

  // login simple
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  // Carga principal
  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        setError(null);

        const [
          productData,
          summaryResponse,
          analyticsData,
          priceCompData,
          priceHistData,
        ] = await Promise.all([
          getProductById(id),
          getProductSummary(id),     // { product, summary, reviews }
          getReviewAnalytics(id),
          getPriceComparison(id),
          getPriceHistory(id),
        ]);

        setProduct(productData || null);
        setSummary(summaryResponse?.summary || null);   // 👈 solo la parte summary
        setAnalytics(analyticsData || null);
        setPriceComparison(priceCompData || { stores: [] });
        setPriceHistory(priceHistData || { points: [] });

        // si quieres usar las reseñas “destacadas” del summary:
        // setReviews(summaryResponse?.reviews || []);
      } catch (err) {
        console.error("Error loading product detail:", err);
        setError(err.message || "Error cargando producto");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAll();
    }
  }, [id]);

  // Carga de reseñas (lista completa / filtrada)
  useEffect(() => {
    async function loadReviews() {
      try {
        setReviewsLoading(true);
        const data = await getProductReviews(id, sentimentFilter);
        setReviews(data?.reviews || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    if (id) {
      loadReviews();
    }
  }, [id, sentimentFilter]);

  async function handleCreateReview(e) {
    e.preventDefault();
    if (!isLoggedIn) {
      setCreateError("Debes iniciar sesión para crear reseñas.");
      return;
    }

    try {
      setCreatingReview(true);
      setCreateError(null);

      await createReview(id, {
        rating: Number(rating),
        content,
        sentiment,
        isVerified,
        source,
      });

      // recargar summary, analytics y reseñas
      const [summaryResponse, analyticsData, reviewsData] = await Promise.all([
        getProductSummary(id),
        getReviewAnalytics(id),
        getProductReviews(id, sentimentFilter),
      ]);

      setSummary(summaryResponse?.summary || null);   // 👈 igual que arriba
      setAnalytics(analyticsData || null);
      setReviews(reviewsData?.reviews || []);

      // limpiar formulario
      setRating(5);
      setContent("");
      setSentiment("POSITIVE");
      setSource("Manual");
      setIsVerified(true);
    } catch (err) {
      console.error("Error creating review:", err);
      setCreateError(err.message || "Error creando reseña");
    } finally {
      setCreatingReview(false);
    }
  }

  function handleLogout() {
    logout();          // borra token (client.clearAuthToken)
    setIsLoggedIn(false);
    navigate("/");
  }

  // helpers % sentimientos
  const sentimentPercentages = useMemo(() => {
    if (!analytics || !analytics.total_reviews) {
      return { positive: 0, neutral: 0, negative: 0 };
    }
    const total = analytics.total_reviews || 0;
    if (!total) return { positive: 0, neutral: 0, negative: 0 };

    return {
      positive: Math.round(((analytics.positive_count || 0) / total) * 100),
      neutral: Math.round(((analytics.neutral_count || 0) / total) * 100),
      negative: Math.round(((analytics.negative_count || 0) / total) * 100),
    };
  }, [analytics]);

  if (loading) {
    return (
      <div className="page">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <button className="btn small" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <p style={{ color: "salmon" }}>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <button className="btn small" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <p>No se encontró el producto.</p>
      </div>
    );
  }

  // valores seguros para summary
  const avgRating =
    summary && typeof summary.average_rating === "number"
      ? summary.average_rating
      : 0;
  const totalReviews =
    summary && typeof summary.total_reviews === "number"
      ? summary.total_reviews
      : 0;
  const highlightText = summary?.highlight || "Sin resumen disponible.";

  const safeStores = Array.isArray(priceComparison?.stores)
    ? priceComparison.stores
    : [];
  const cheapest = priceComparison?.cheapest || null;
  const diffToMostExp = priceComparison?.difference_to_most_expensive ?? null;
  const historyPoints = Array.isArray(priceHistory?.points)
    ? priceHistory.points
    : [];

  return (
    <div className="page">
      {/* barra superior simple */}
      <div className="top-bar">
        <button className="btn small" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="btn secondary small"
          onClick={() => navigate("/search")}
        >
          Buscar otro producto
        </button>
        {isLoggedIn && (
          <button
            className="btn ghost small"
            style={{ marginLeft: "0.5rem" }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        )}
      </div>

      <h1 className="page-title">{product.name}</h1>
      {product.category && (
        <p className="muted">
          Categoría: <strong>{product.category}</strong>
        </p>
      )}
      {product.external_link && (
        <p className="muted">
          Enlace oficial:{" "}
          <a href={product.external_link} target="_blank" rel="noreferrer">
            {product.external_link}
          </a>
        </p>
      )}

      {/* grid principal */}
      <div className="grid-2">
        {/* Columna izquierda: resumen y reseñas */}
        <div className="column">
          {/* Resumen general */}
          <section className="card">
            <h2>Resumen de reseñas</h2>
            {summary ? (
              <>
                <div className="rating-row">
                  <div className="rating-main">
                    <div className="rating-value">{avgRating.toFixed(1)}</div>
                    <div className="rating-stars">
                      {renderStars(avgRating)}
                    </div>
                    <div className="rating-count">
                      {totalReviews} reseñas analizadas
                    </div>
                  </div>
                </div>
                <p className="highlight">{highlightText}</p>
              </>
            ) : (
              <p>No hay resumen disponible.</p>
            )}
          </section>

          {/* Distribución de sentimientos */}
          <section className="card">
            <h3>Distribución de opiniones</h3>
            {analytics ? (
              <>
                <p className="muted">
                  Total reseñas:{" "}
                  <strong>{analytics.total_reviews || 0}</strong>
                </p>

                <SentimentBar
                  label="Positivas"
                  count={analytics.positive_count || 0}
                  percent={sentimentPercentages.positive}
                  color="#4caf50"
                />
                <SentimentBar
                  label="Neutras"
                  count={analytics.neutral_count || 0}
                  percent={sentimentPercentages.neutral}
                  color="#ffc107"
                />
                <SentimentBar
                  label="Negativas"
                  count={analytics.negative_count || 0}
                  percent={sentimentPercentages.negative}
                  color="#f44336"
                />
              </>
            ) : (
              <p>Sin datos de analítica.</p>
            )}
          </section>

          {/* Reseñas + filtro */}
          <section className="card">
            <div className="card-header">
              <h3>Reseñas detalladas</h3>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
              >
                <option value="ALL">Todas</option>
                <option value="POSITIVE">Positivas</option>
                <option value="NEUTRAL">Neutras</option>
                <option value="NEGATIVE">Negativas</option>
              </select>
            </div>

            {reviewsLoading && <p>Cargando reseñas...</p>}

            {!reviewsLoading && reviews.length === 0 && (
              <p className="muted">No hay reseñas para este filtro.</p>
            )}

            <div className="reviews-list">
              {reviews.map((r) => (
                <article key={r.id} className="review-card">
                  <header className="review-header">
                    <span className="badge source">{r.source}</span>
                    <span className="badge sentiment">{r.sentiment}</span>
                    {r.is_verified && (
                      <span className="badge verified">Verificada</span>
                    )}
                  </header>
                  <div className="review-rating">
                    {renderStars(r.rating)}{" "}
                    <span className="muted">
                      ({r.rating}/5) · {formatDate(r.created_at)}
                    </span>
                  </div>
                  <p>{r.content}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Columna derecha: precios + nueva reseña */}
        <div className="column">
          {/* Comparador de precios */}
          <section className="card">
            <h2>Comparación de precios</h2>
            {safeStores.length > 0 ? (
              <>
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>Tienda</th>
                      <th>Precio</th>
                      <th>Actualizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeStores.map((s) => {
                      const isCheapest =
                        cheapest && cheapest.store === s.store;
                      return (
                        <tr
                          key={`${s.store}-${s.created_at || ""}`}
                          className={
                            isCheapest ? "row-cheapest" : undefined
                          }
                        >
                          <td>{s.store}</td>
                          <td>
                            {s.price} {s.currency}
                            {isCheapest && (
                              <span className="tag">Más barato</span>
                            )}
                          </td>
                          <td>{formatDate(s.last_updated)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {diffToMostExp != null && cheapest && (
                  <p className="muted">
                    Diferencia entre la opción más barata y la más
                    costosa:{" "}
                    <strong>
                      {diffToMostExp.toFixed(2)} {cheapest.currency}
                    </strong>
                  </p>
                )}
              </>
            ) : (
              <p className="muted">
                No hay datos de precios para este producto.
              </p>
            )}
          </section>

          {/* Historial de precios (simple) */}
          <section className="card">
            <h3>Tendencia de precios</h3>
            {historyPoints.length > 0 ? (
              <table className="price-table small">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tienda</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {historyPoints.map((p, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(p.created_at)}</td>
                      <td>{p.store}</td>
                      <td>
                        {p.price} {p.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted">
                Aún no hay historial de precios registrado.
              </p>
            )}
          </section>

          {/* Formulario nueva reseña */}
          <section className="card">
            <h3>Agregar reseña</h3>
            {!isLoggedIn && (
              <p className="muted">
                Debes iniciar sesión para crear reseñas.
              </p>
            )}

            <form onSubmit={handleCreateReview} className="review-form">
              <div className="field-row">
                <label>
                  Calificación:
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    disabled={!isLoggedIn || creatingReview}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} estrellas
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Sentimiento:
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value)}
                    disabled={!isLoggedIn || creatingReview}
                  >
                    <option value="POSITIVE">Positivo</option>
                    <option value="NEUTRAL">Neutro</option>
                    <option value="NEGATIVE">Negativo</option>
                  </select>
                </label>
              </div>

              <label>
                Fuente:
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  disabled={!isLoggedIn || creatingReview}
                />
              </label>

              <label>
                Comentario:
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  disabled={!isLoggedIn || creatingReview}
                  placeholder="Escribe tu opinión sobre este producto..."
                />
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  disabled={!isLoggedIn || creatingReview}
                />
                ¿Compra verificada?
              </label>

              {createError && (
                <p style={{ color: "salmon", marginBottom: 8 }}>
                  {createError}
                </p>
              )}

              <button
                className="btn"
                type="submit"
                disabled={!isLoggedIn || creatingReview}
              >
                {creatingReview ? "Guardando reseña..." : "Publicar reseña"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

// Componente pequeño para las barras de sentimiento
function SentimentBar({ label, count, percent, color }) {
  return (
    <div className="sentiment-row">
      <div className="sentiment-label">
        {label}{" "}
        <span className="muted">
          ({count} · {percent}%)
        </span>
      </div>
      <div className="sentiment-bar">
        <div
          className="sentiment-bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
