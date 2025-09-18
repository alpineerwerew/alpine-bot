import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products.json"; // ⚡ Lecture des données

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="text-white p-6">❌ Produit introuvable</div>;
  }

  return (
    <div className="min-h-screen text-white py-4 px-4 sm:py-6 sm:px-6 bg-opacity-95 overflow-y-auto relative">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto pb-20 relative z-10">
        <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/95 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/80 backdrop-blur-sm">
          
          {/* Image produit */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg flex justify-center bg-black">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-auto object-contain select-none"
              loading="lazy"
            />
          </div>

          {/* Infos produit */}
          <div className="p-5 sm:p-6 space-y-5 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {product.title}
                </h2>
                <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center self-start shadow-sm">
                  Farm: {product.producer}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center shadow-sm">
                  {product.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p
                className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Strains / Variétés */}
            {product.strains?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Variétés (Strains)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.strains.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 shadow-sm"
                    >
                      <span className="text-base">{s.emoji}</span>
                      <span className="font-semibold">{s.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prix */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-white mb-3">
                Sélectionner la Quantité
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {product.prices.map((p, index) => (
                  <button
                    key={index}
                    className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-2.5 shadow-lg shadow-yellow-500/5"
                  >
                    <span className="text-gray-300 font-medium text-sm">
                      {p.weight}
                    </span>
                    <span className="text-yellow-400 font-bold text-base ml-2">
                      {p.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons Commander + Retour */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://linktr.ee/alpinec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3.5 px-4 rounded-xl shadow-lg transition-all duration-300 font-medium"
              >
                📩 Commander Maintenant
              </a>
              <Link
                to="/products"
                className="flex-1 flex items-center justify-center bg-gray-800 text-white py-3.5 px-4 rounded-xl shadow-lg"
              >
                ⬅️ Retour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
