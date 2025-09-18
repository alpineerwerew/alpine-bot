import React, { useState } from "react";
import Footer from "../components/Footer";

function AccordionCard({ title, icon, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-yellow-500/20 hover:scale-[1.02]">
      <div
        onClick={() => setOpen(!open)}
        className="p-4 sm:p-6 cursor-pointer flex items-center justify-between hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-yellow-400 text-lg shadow-inner">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 text-yellow-400 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>

      <div
        className={`px-4 pb-4 sm:px-6 sm:pb-6 text-gray-300 transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden pb-20">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/background.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none"></div>
      </div>

      {/* Blobs */}
      <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse"></div>
      <div className="fixed bottom-40 right-10 w-40 h-40 rounded-full bg-blue-500 opacity-20 blur-3xl animate-ping"></div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow pb-20">
          {/* Logo centré avec halo hover */}
          <div className="pt-20 flex justify-center">
            <div className="relative group inline-block">
              {/* Halo gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 blur-3xl transition duration-500 group-hover:opacity-40"></div>

              <img
                src="/logo.png"
                alt="Alpine Connexion"
                className="relative w-72 md:w-96 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Accordéons */}
          <div className="max-w-md mx-auto mt-12 space-y-4">
            <AccordionCard title="Nos Services" icon="🚚">
              <p>
                Livraison premium et discrète en Suisse & International. Service
                rapide, fiable et sécurisé.
              </p>
            </AccordionCard>

            <AccordionCard title="Zones de Livraison" icon="📦">
              <p>Suisse entière + envois internationaux sécurisés.</p>
              <p className="text-yellow-400 mt-2 text-sm">
                ⚠️ Des frais supplémentaires peuvent s’appliquer selon votre
                localisation.
              </p>
            </AccordionCard>

            <AccordionCard title="Meet-up" icon="📍">
              <p>Rendez-vous disponibles 7j/7 à Valais Centre.</p>
            </AccordionCard>

            <AccordionCard title="Notre Engagement" icon="❤️">
              <p className="italic">
                Produits sélectionnés avec soin pour garantir qualité,
                sécurité et satisfaction.
              </p>
            </AccordionCard>

            <AccordionCard title="Modes de Paiement" icon="💳">
              <div className="space-y-3">
                {/* Paiement Cash */}
                <div className="p-3 bg-gray-800/60 rounded-lg flex items-center hover:bg-gray-700/70 transition-all duration-200">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">💶</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">
                      Paiement en Cash
                    </p>
                    <p className="text-xs text-gray-400">À la livraison</p>
                  </div>
                </div>

                {/* Paiement Crypto */}
                <div className="p-3 bg-gray-800/60 rounded-lg flex items-center hover:bg-gray-700/70 transition-all duration-200">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">₿</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">
                      Cryptomonnaie
                    </p>
                    <p className="text-xs text-gray-400">
                      Paiement à l’avance
                    </p>
                  </div>
                </div>
              </div>
            </AccordionCard>
          </div>

          {/* Copyright */}
          <div className="mt-12 text-center text-gray-400 text-xs">
            © 2025 Alpine Connexion – Tous droits réservés
          </div>
        </main>
      </div>

      {/* Footer global */}
      <Footer />
    </div>
  );
}
