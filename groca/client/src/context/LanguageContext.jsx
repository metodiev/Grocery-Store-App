import { createContext, useEffect, useMemo, useState } from "react";

import { translations } from "../i18n/translations";

export const LanguageContext = createContext(null);

const LANGUAGE_STORAGE_KEY = "groca_language";

const interpolate = (template, params = {}) => {
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value));
  }, template);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && ["en", "bg"].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (nextLanguage) => {
    if (!["en", "bg"].includes(nextLanguage)) {
      return;
    }
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  };

  const t = (key, params) => {
    const dictionary = translations[language] || translations.en;
    const fallbackDictionary = translations.en;
    const text = dictionary[key] ?? fallbackDictionary[key] ?? key;
    return interpolate(text, params);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      t
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
