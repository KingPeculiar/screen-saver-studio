import { createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * ThemeContext is intentionally created with `undefined` as the default value
 * so that the `useTheme` hook can assert that it is used inside a provider.
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

/**
 * Hook to read and update the current theme.
 * Throws a helpful error if used outside of a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
