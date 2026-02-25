import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ThemePreference,
  ResolvedTheme,
  applyResolvedTheme,
  getStoredThemePreference,
  getSystemTheme,
  resolveTheme,
  setStoredThemePreference,
} from "~/theme/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<ThemePreference>(() => getStoredThemePreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(preference));

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(preference);

    setResolvedTheme(nextResolvedTheme);
    applyResolvedTheme(nextResolvedTheme);
    setStoredThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    if (typeof window === "undefined" || preference !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const onSystemThemeChange = () => {
      const nextResolvedTheme = getSystemTheme();
      setResolvedTheme(nextResolvedTheme);
      applyResolvedTheme(nextResolvedTheme);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onSystemThemeChange);
    } else {
      mediaQuery.addListener(onSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", onSystemThemeChange);
      } else {
        mediaQuery.removeListener(onSystemThemeChange);
      }
    };
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
    }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
