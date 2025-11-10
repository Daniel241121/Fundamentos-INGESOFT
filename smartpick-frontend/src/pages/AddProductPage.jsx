// src/pages/AddProductPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/smartpick";
import { getAuthToken } from "../api/client";

export default function AddProductPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // campos del formulario
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // al montar, revisamos si hay token
  useEffect(() => {
    const hasToken = !!getAuthToken();
    setIsLoggedIn(hasToken);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        name: name.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        externalLink: externalLink.trim() || null,
      };

      const result = await createProduct(body);
      // backend devuelve: { message, product }
      const product = result.product;

      setSuccessMessage("Producto creado correctamente.");

      // opcional: limpiar formulario
      setName("");
      setCategory("");
      setExternalLink("");
      setDescription("");

      // navegar al detalle del nuevo producto
      if (product && product.id) {
        setTimeout(() => {
          navigate(`/products/${product.id}`);
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creando producto");
    } finally {
      setLoading(false);
    }
  }

  // Si NO está logueado, mostramos mensaje y botón a login
  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="top-bar">
          <button className="btn small" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>

        <div className="card" style={{ maxWidth: 520 }}>
          <h1 className="page-title">Agregar producto</h1>
          <p className="muted" style={{ marginBottom: "1rem" }}>
            Debes iniciar sesión para poder registrar nuevos productos.
          </p>
          <button
            className="btn"
            onClick={() => navigate("/login")}
            style={{ width: "100%" }}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  // Si SÍ está logueado, mostramos el formulario
  return (
    <div className="page">
      <div className="top-bar">
        <button className="btn small" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="btn secondary small"
          onClick={() => navigate("/")}
        >
          Inicio
        </button>
      </div>

      <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 className="page-title">Registrar nuevo producto</h1>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Completa los datos básicos del producto. Más adelante podrás ver sus
          reseñas, comparaciones de precio y analítica.
        </p>

        <form className="review-form" onSubmit={handleSubmit}>
          <label>
            Nombre del producto *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: iPhone 16 Pro"
              disabled={loading}
            />
          </label>

          <label>
            Categoría
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Electronics, Smartphones..."
              disabled={loading}
            />
          </label>

          <label>
            Enlace externo (opcional)
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              disabled={loading}
            />
          </label>

          <label>
            Descripción
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve del producto..."
              disabled={loading}
            />
          </label>

          {error && (
            <p style={{ color: "salmon", marginBottom: "0.5rem" }}>
              {error}
            </p>
          )}

          {successMessage && (
            <p style={{ color: "#4caf50", marginBottom: "0.5rem" }}>
              {successMessage}
            </p>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Crear producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
