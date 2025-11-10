// src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProducts } from "../api/smartpick";
import { getAuthToken, setAuthToken } from "../api/client";

function useQueryParam(name) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get(name) || "";
}

export default function SearchPage() {
  const navigate = useNavigate();
  const initialQuery = useQueryParam("query") || "iPhone";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  useEffect(() => {
    if (!initialQuery) return;
    handleSearch(initialQuery, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  async function handleSearch(q, updateUrl = true) {
    const term = (q ?? query).trim();
    if (!term) return;

    try {
      setLoading(true);
      setError(null);

      if (updateUrl) {
        navigate(`/search?query=${encodeURIComponent(term)}`, {
          replace: true,
        });
      }

      const data = await searchProducts(term);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error buscando productos");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  function handleLogout() {
    setAuthToken(null);
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <div className="page">
      {/* Header */}
      <header className="landing-header">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          SmartPick
        </div>
        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <button
                className="btn secondary small"
                onClick={() => navigate("/add-product")}
              >
                Agregar producto
              </button>
              <button className="btn ghost small" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ marginTop: "2rem" }}>
        <h1 className="page-title">SmartPick - Búsqueda de productos</h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ej: "iPhone", "Mouse Logitech"...'
            style={{ flex: 1 }}
          />
          <button className="btn" type="submit">
            Buscar
          </button>
        </form>

        {error && (
          <p style={{ color: "salmon", marginTop: "0.75rem" }}>{error}</p>
        )}

        {loading && <p style={{ marginTop: "1rem" }}>Buscando...</p>}

        {!loading && !error && (
          <div style={{ marginTop: "1.5rem" }}>
            {results.length === 0 ? (
              <p className="muted">
                No hay resultados. Prueba buscando &quot;iPhone&quot;.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {results.map((p) => (
                  <button
                    key={p.id}
                    className="card"
                    style={{ textAlign: "left" }}
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    <strong>{p.name}</strong>
                    {p.category && (
                      <span className="muted"> · {p.category}</span>
                    )}
                    {p.description && (
                      <p className="muted" style={{ marginTop: "0.25rem" }}>
                        {p.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
