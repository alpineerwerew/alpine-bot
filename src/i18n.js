import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import des fichiers de traduction
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n
  .use(LanguageDetector) // ✅ Ajout du détecteur
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
    },
    fallbackLng: "en", // 🔁 Si une traduction manque → anglais
    interpolation: {
      escapeValue: false, // ⚡ React gère déjà la sécurité XSS
    },
    detection: {
      order: ["localStorage", "navigator"], // ✅ Vérifie d'abord la langue sauvegardée
      caches: ["localStorage"],             // ✅ Sauvegarde la langue dans le navigateur
    },
  });

export default i18n;
