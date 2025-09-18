import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button onClick={() => i18n.changeLanguage("fr")}>🇫🇷</button>
      <button onClick={() => i18n.changeLanguage("en")}>🇬🇧</button>
      <button onClick={() => i18n.changeLanguage("de")}>🇩🇪</button>
    </div>
  );
}