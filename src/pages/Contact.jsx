import React from "react";
import Footer from "../components/Footer";

export default function Contact() {
  const contacts = [
    {
      title: "LinkTree",
      description: "Accédez à tous nos canaux en un clic",
      href: "https://linktr.ee/alpinec",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-8 h-8"
          fill="currentColor"
        >
          <path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208h24.9L30.6 281.4c-4.2 4.2-6.6 10-6.6 16 0 12.5 10.1 22.6 22.6 22.6H80L5.4 409.5C1.9 413.7 0 419 0 424.5 0 437.5 10.5 448 23.5 448H192v32c0 17.7 14.3 32 32 32s32-14.3 32-32v-32h168.5c13 0 23.5-10.5 23.5-23.5 0-5.5-1.9-10.8-5.4-15L368 320h33.4c12.5 0 22.6-10.1 22.6-22.6 0-6-2.4-11.8-6.6-16L344 208h24.9c12.7 0 23.1-10.3 23.1-23.1 0-5.7-2.1-11.3-6-15.5L237.4 5.9A16 16 0 0 0 224 0a16 16 0 0 0-13.4 5.9z" />
        </svg>
      ),
    },
    {
      title: "WhatsApp",
      description: "Contactez-nous directement",
      href: "https://wa.me/33745558764",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-8 h-8"
          fill="currentColor"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z" />
        </svg>
      ),
    },
    {
      title: "Telegram",
      description: "Rejoignez notre canal pour les mises à jour",
      href: "https://t.me/alpineconnexion", // <-- adapte ton vrai canal
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
          className="w-8 h-8"
          fill="currentColor"
        >
          <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8z" />
        </svg>
      ),
    },
    {
      title: "Instagram",
      description: "Suivez-nous sur Instagram",
      href: "https://instagram.com/alpineconnexion", // <-- ton lien
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          className="w-8 h-8"
          fill="currentColor"
        >
          <path d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7z" />
        </svg>
      ),
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
          <h1 className="font-bold text-5xl text-center py-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-500">
            Nous Contacter
          </h1>

          <div className="space-y-6 max-w-md mx-auto">
            {contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <div className="mr-6 text-yellow-400">{c.icon}</div>
                <div>
                  <h2 className="text-2xl font-semibold">{c.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">{c.description}</p>
                </div>
                <div className="ml-auto text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </main>

        {/* Footer global */}
        <Footer />
      </div>
    </div>
  );
}
