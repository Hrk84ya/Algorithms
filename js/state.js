/**
 * App State module — fetches the algorithm manifest and provides
 * lookup / filtering helpers.
 *
 * @typedef {Object} AppState
 * @property {Object[]} algorithms - All algorithms from manifest
 * @property {string[]} categories - Unique category list
 * @property {boolean} loaded - Whether manifest has been fetched
 * @property {string|null} error - Error message if manifest fetch failed
 */

/**
 * Fetches algorithms.json (relative path) and initializes state.
 * @returns {Promise<AppState>}
 */
export async function initState() {
  try {
    const response = await fetch('algorithms.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.status}`);
    }
    const algorithms = await response.json();
    const categories = [...new Set(algorithms.map(a => a.category))];
    return { algorithms, categories, loaded: true, error: null };
  } catch (err) {
    return { algorithms: [], categories: [], loaded: false, error: err.message };
  }
}

/**
 * Returns algorithms filtered by category, difficulty, and/or search query.
 * All criteria are applied simultaneously (AND logic).
 * @param {AppState} state
 * @param {Object} filters
 * @param {string} [filters.category]
 * @param {string} [filters.difficulty]
 * @param {string} [filters.query]
 * @returns {Object[]}
 */
export function filterAlgorithms(state, { category, difficulty, query } = {}) {
  return state.algorithms.filter(algo => {
    if (category && algo.category !== category) return false;
    if (difficulty && difficulty !== 'all' && algo.difficulty !== difficulty) return false;
    if (query && !algo.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
}

/**
 * Returns a single algorithm by its id, or null if not found.
 * @param {AppState} state
 * @param {string} id
 * @returns {Object|null}
 */
export function getAlgorithm(state, id) {
  return state.algorithms.find(a => a.id === id) ?? null;
}
