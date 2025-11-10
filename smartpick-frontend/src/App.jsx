// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import AddProductPage from "./pages/AddProductPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Búsqueda y detalle */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Agregar producto (frontend lo protege, backend también) */}
        <Route path="/add-product" element={<AddProductPage />} />

        {/* Cualquier otra ruta → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
