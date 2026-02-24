export type ThemePreference = "light" | "system" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "memento-theme-preference";

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "light" || value === "system" || value === "dark";

export const getStoredThemePreference = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isThemePreference(stored) ? stored : "system";
};

export const setStoredThemePreference = (value: ThemePreference) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, value);
};

export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const resolveTheme = (preference: ThemePreference): ResolvedTheme => {
  if (preference === "system") {
    return getSystemTheme();
  }

  return preference;
};

export const applyResolvedTheme = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const isDark = resolvedTheme === "dark";

  root.classList.toggle("dark", isDark);
  root.style.colorScheme = resolvedTheme;
};

export const themeInitScript = `(() => {
  try {
    const THEME_STORAGE_KEY = "${THEME_STORAGE_KEY}";
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preference = stored === "light" || stored === "system" || stored === "dark" ? stored : "system";
    const isDark = preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch (_error) {
    // ignore
  }
})();`;
