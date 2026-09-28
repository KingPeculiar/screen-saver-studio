import React, { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";
import type { ThemeContextValue, Theme } from "./theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

/**
 * ThemeProvider
 *
 * Manages the app theme (dark | light | system), persists choice to localStorage,
 * and updates the document root class accordingly. It uses the shared ThemeContext
 * (kept in a separate file) to expose `theme` and `setTheme`.
 *
 * This file intentionally only exports the provider component so fast refresh
 * remains friendly for component-only files.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const getInitialTheme = (): Theme => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      return stored || defaultTheme;
    } catch {
      return defaultTheme;
    }
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // ignore localStorage failures
    }
    setThemeState(newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(systemDark ? "dark" : "light");
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
