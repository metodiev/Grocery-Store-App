import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "groca_theme";
const THEMES = ["green", "ocean", "sunset", "berry"];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("green");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && THEMES.includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const changeTheme = (nextTheme) => {
    if (!THEMES.includes(nextTheme)) {
      return;
    }
    setTheme(nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      themes: THEMES,
      setTheme: changeTheme
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
