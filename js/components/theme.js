/**
 * Theme Manager — toggles dark/light mode and persists preference.
 *
 * localStorage key: "algo-learn-theme" (values: "light" | "dark")
 * Applies theme via data-theme attribute on <html>.
 * Swaps Highlight.js theme stylesheets (hljs-theme-light / hljs-theme-dark).
 * Graceful degradation if localStorage is unavailable.
 */

const STORAGE_KEY = 'algo-learn-theme';

/**
 * Safely read from localStorage.
 * @returns {string|null}
 */
function readTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Safely write to localStorage.
 * @param {string} theme
 */
function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable — theme works for session only
  }
}

/**
 * Apply the given theme to the document.
 * Sets data-theme on <html>, swaps Highlight.js stylesheets,
 * and updates the toggle button icon.
 * @param {string} theme - "light" or "dark"
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  const lightSheet = document.getElementById('hljs-theme-light');
  const darkSheet = document.getElementById('hljs-theme-dark');

  if (lightSheet && darkSheet) {
    if (theme === 'dark') {
      lightSheet.disabled = true;
      darkSheet.disabled = false;
    } else {
      lightSheet.disabled = false;
      darkSheet.disabled = true;
    }
  }

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Reads localStorage for saved theme. If not set, checks system preference.
 * Applies the resolved theme to the document.
 */
export function initTheme() {
  const saved = readTheme();
  let theme;

  if (saved === 'light' || saved === 'dark') {
    theme = saved;
  } else {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  applyTheme(theme);
  saveTheme(theme);
}

/**
 * Toggles between light and dark themes.
 * Updates data-theme on <html>, swaps Highlight.js stylesheets,
 * and persists the new theme to localStorage.
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
}
