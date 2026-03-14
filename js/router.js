/**
 * @typedef {Object} Route
 * @property {string} view - 'landing' | 'category' | 'algorithm'
 * @property {string} [category] - Category slug (e.g., 'sorting')
 * @property {string} [algorithmId] - Algorithm identifier from manifest
 */

const LANDING_ROUTE = { view: 'landing' };

/**
 * Parses window.location.hash into a Route object.
 * @param {string} hash - The hash string (e.g., '#/category/sorting')
 * @returns {Route}
 */
export function parseRoute(hash) {
  const trimmed = (hash || '').replace(/^#\/?/, '');

  if (!trimmed) {
    return { ...LANDING_ROUTE };
  }

  const segments = trimmed.split('/');

  if (segments[0] === 'category' && segments[1]) {
    return { view: 'category', category: segments[1] };
  }

  if (segments[0] === 'algorithm' && segments[1]) {
    return { view: 'algorithm', algorithmId: segments[1] };
  }

  // Unknown pattern → fallback to landing
  return { ...LANDING_ROUTE };
}

/**
 * Registers a callback invoked on every hash change.
 * Also fires immediately with the current route.
 * @param {(route: Route) => void} callback
 */
export function onRouteChange(callback) {
  const handler = () => callback(parseRoute(window.location.hash));
  window.addEventListener('hashchange', handler);
  handler();
}

/**
 * Programmatically navigates to a new hash.
 * @param {string} hash - The hash to navigate to (e.g., '#/category/sorting')
 */
export function navigate(hash) {
  window.location.hash = hash;
}
