import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact"; // ✅ Ajout Contact

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Accueil */}
        <Route path="/" element={<Home />} />

        {/* Catalogue Produits */}
        <Route path="/products" element={<Product />} />

        {/* Page détail Produit */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Page Contact */}
        <Route path="/contact" element={<Contact />} /> {/* ✅ ajout */}
      </Routes>
    </Router>
  );
}
