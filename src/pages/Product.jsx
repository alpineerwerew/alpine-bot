import React from "react";
import Footer from "../components/Footer";
import products from "../data/products.json";
import { useTranslation } from "react-i18next";

export default function Product() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow pb-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">

            {/* Sélecteur de langue */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => changeLanguage("fr")}
                className={`px-3 py-1 rounded-lg ${
                  i18n.language.startsWith("fr")
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-gray-800 hover:bg-yellow-500/30"
                }`}
              >
                🇫🇷
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 rounded-lg ${
                  i18n.language.startsWith("en")
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-gray-800 hover:bg-yellow-500/30"
                }`}
              >
                🇬🇧
              </button>
              <button
                onClick={() => changeLanguage("de")}
                className={`px-3 py-1 rounded-lg ${
                  i18n.language.startsWith("de")
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-gray-800 hover:bg-yellow-500/30"
                }`}
              >
                🇩🇪
              </button>
            </div>

            {/* Titre */}
            <h1 className="text-center font-bold text-5xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-500 mb-10">
              {t("all_products")}
            </h1>

            {/* Carousel Produits */}
            <div className="flex overflow-x-auto space-x-6 snap-x snap-mandatory scrollbar-hide pb-6">
              {products.map((p) => (
                <a
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="flex-shrink-0 w-64 snap-start"
                >
                  <div className="cursor-pointer flex flex-col w-full relative overflow-hidden rounded-2xl bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-yellow-500/30 hover:border-yellow-400 hover:scale-[1.03]">
                    <div className="relative aspect-square overflow-hidden">
                      {p.media && p.media[0] && p.media[0].type === "image" && (
                        <img
                          src={p.media[0].src}
                          alt={p.title}
                          className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-full bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white shadow-lg flex items-center gap-1.5">
                          {p.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div className="space-y-2">
                        <h5 className="text-lg font-bold tracking-tight text-white line-clamp-2 transition-colors duration-200 hover:text-yellow-400">
                          {p.title}
                        </h5>
                        <span className="text-xs font-medium text-yellow-400 flex items-center">
                          {p.producer}
                        </span>
                      </div>
                      <div className="flex items-baseline mt-auto pt-2">
                        <span className="text-2xl font-bold text-yellow-400 transition-transform duration-200 hover:scale-110">
                          {p.prices[0].price}
                        </span>
                        <span className="text-sm font-medium text-gray-400 ml-1">
                          {p.prices[0].weight}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
