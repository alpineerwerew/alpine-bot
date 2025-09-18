import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import des fichiers de traduction
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de }
    },
    lng: "fr", // 🌍 Langue par défaut (Français)
    fallbackLng: "en", // 🔁 Si une traduction manque, bascule en anglais
    interpolation: {
      escapeValue: false // ⚡ React gère déjà la sécurité XSS
    }
  });

export default i18n;
