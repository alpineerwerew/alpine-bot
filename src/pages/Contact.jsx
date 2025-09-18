import React from "react";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t, i18n } = useTranslation();

  const contacts = [
    {
      title: "LinkTree",
      description: t("linktree_desc"),
      href: "https://linktr.ee/alpinec",
    },
    {
      title: "Instagram",
      description: t("instagram_desc"),
      href: "https://instagram.com/alpinerocket710",
    },
  ];

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden pb-20">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      {/* Orbes lumineux */}
      <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse"></div>
      <div className="fixed bottom-40 right-10 w-40 h-40 rounded-full bg-blue-500 opacity-20 blur-3xl animate-ping"></div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow pb-20">
          {/* Titre */}
          <h1 className="font-bold text-5xl text-center py-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-500">
            {t("contact_us")}
          </h1>

          {/* Boutons de langue */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => i18n.changeLanguage("fr")}
              className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-yellow-500/20"
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => i18n.changeLanguage("en")}
              className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-yellow-500/20"
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => i18n.changeLanguage("de")}
              className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-yellow-500/20"
            >
              🇩🇪 DE
            </button>
          </div>

          {/* Liste des contacts */}
          <div className="space-y-6 max-w-md mx-auto">
            {contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <div className="mr-6 text-yellow-400">🌐</div>
                <div>
                  <h2 className="text-2xl font-semibold">{c.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">{c.description}</p>
                </div>
              </a>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
