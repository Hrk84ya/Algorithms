/**
 * Sidebar Navigation — renders category tree with algorithm links,
 * search input, and difficulty filter dropdown.
 *
 * Renders into the existing #sidebar element. Highlights the currently
 * selected algorithm. Search filters the algorithm list in real-time
 * (case-insensitive name match). Shows "No results found" when combined
 * search + difficulty filter matches nothing. Displays difficulty tag
 * next to each algorithm name. Fully keyboard navigable with ARIA labels.
 *
 * The hamburger menu collapse behavior is handled by CSS and the
 * nav-toggle button in app.js — this module only renders sidebar content.
 */

import { navigate } from '../router.js';
import { filterAlgorithms } from '../state.js';

/** Category display metadata keyed by slug */
const CATEGORY_META = {
  data_structures: { label: 'Data Structures' },
  dynamic_programming: { label: 'Dynamic Programming' },
  graph: { label: 'Graph' },
  mathematical: { label: 'Mathematical' },
  search: { label: 'Search' },
  sorting: { label: 'Sorting' },
  string: { label: 'String' },
  tree: { label: 'Tree' },
};

/**
 * Maps a difficulty string to the corresponding CSS class.
 * @param {string} difficulty
 * @returns {string}
 */
function difficultyClass(difficulty) {
  return `difficulty-${difficulty.toLowerCase()}`;
}

/**
 * Renders the sidebar navigation into the given container.
 * @param {HTMLElement} container - The #sidebar element
 * @param {import('../state.js').AppState} state
 * @param {string|null} currentAlgorithmId - Currently selected algorithm ID
 */
export function renderNavigation(container, state, currentAlgorithmId) {
  container.innerHTML = '';

  // --- Search input ---
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.id = 'nav-search';
  searchInput.placeholder = 'Search algorithms…';
  searchInput.setAttribute('aria-label', 'Search algorithms');
  container.appendChild(searchInput);

  // --- Difficulty filter dropdown ---
  const filterSelect = document.createElement('select');
  filterSelect.id = 'nav-difficulty-filter';
  filterSelect.setAttribute('aria-label', 'Filter by difficulty');

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  difficulties.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    filterSelect.appendChild(option);
  });

  container.appendChild(filterSelect);

  // --- Algorithm list container ---
  const listContainer = document.createElement('div');
  listContainer.id = 'nav-algorithm-list';
  listContainer.setAttribute('role', 'tree');
  listContainer.setAttribute('aria-label', 'Algorithm categories');
  container.appendChild(listContainer);

  // Initial render of the tree
  renderAlgorithmTree(listContainer, state, currentAlgorithmId, '', null);
}

/**
 * Renders the category tree with algorithm links into the list container.
 * @param {HTMLElement} listContainer
 * @param {import('../state.js').AppState} state
 * @param {string|null} currentAlgorithmId
 * @param {string} query - Search query
 * @param {string|null} difficulty - Difficulty filter (null or 'all' means no filter)
 */
function renderAlgorithmTree(listContainer, state, currentAlgorithmId, query, difficulty) {
  listContainer.innerHTML = '';

  const filtered = filterAlgorithms(state, {
    query: query || undefined,
    difficulty: difficulty && difficulty !== 'all' ? difficulty : undefined,
  });

  if (filtered.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'no-results';
    noResults.textContent = 'No results found';
    listContainer.appendChild(noResults);
    return;
  }

  // Group filtered algorithms by category
  const grouped = {};
  for (const algo of filtered) {
    if (!grouped[algo.category]) {
      grouped[algo.category] = [];
    }
    grouped[algo.category].push(algo);
  }

  // Render each category that has matching algorithms
  for (const category of state.categories) {
    const algos = grouped[category];
    if (!algos || algos.length === 0) continue;

    const meta = CATEGORY_META[category] || { label: category };

    const categoryGroup = document.createElement('div');
    categoryGroup.className = 'nav-category';
    categoryGroup.setAttribute('role', 'treeitem');
    categoryGroup.setAttribute('aria-expanded', 'true');
    categoryGroup.setAttribute('aria-label', meta.label);

    const categoryHeading = document.createElement('h3');
    categoryHeading.className = 'nav-category-title';
    categoryHeading.textContent = meta.label;
    categoryHeading.id = `nav-cat-${category}`;
    categoryGroup.appendChild(categoryHeading);

    const algoList = document.createElement('ul');
    algoList.className = 'nav-algorithm-list';
    algoList.setAttribute('role', 'group');
    algoList.setAttribute('aria-labelledby', `nav-cat-${category}`);

    for (const algo of algos) {
      const li = document.createElement('li');
      li.setAttribute('role', 'treeitem');

      const link = document.createElement('a');
      link.href = `#/algorithm/${algo.id}`;
      link.setAttribute('aria-label', `${algo.name}, ${algo.difficulty} difficulty`);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(`#/algorithm/${algo.id}`);
      });

      if (algo.id === currentAlgorithmId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }

      // Algorithm name text
      const nameSpan = document.createElement('span');
      nameSpan.className = 'nav-algo-name';
      nameSpan.textContent = algo.name;
      link.appendChild(nameSpan);

      // Difficulty tag
      const tag = document.createElement('span');
      tag.className = difficultyClass(algo.difficulty);
      tag.textContent = algo.difficulty;
      link.appendChild(tag);

      li.appendChild(link);
      algoList.appendChild(li);
    }

    categoryGroup.appendChild(algoList);
    listContainer.appendChild(categoryGroup);
  }
}

/**
 * Attaches search and filter event listeners to the navigation controls.
 * Re-renders the algorithm tree when criteria change, and optionally
 * calls onFilter to notify the app.
 *
 * @param {import('../state.js').AppState} state
 * @param {string|null} currentAlgorithmId
 * @param {((query: string, difficulty: string|null) => void)|null} [onFilter]
 */
export function initNavigationFilters(state, currentAlgorithmId, onFilter) {
  const searchInput = document.getElementById('nav-search');
  const filterSelect = document.getElementById('nav-difficulty-filter');
  const listContainer = document.getElementById('nav-algorithm-list');

  if (!searchInput || !filterSelect || !listContainer) return;

  function handleFilterChange() {
    const query = searchInput.value.trim();
    const difficulty = filterSelect.value;
    renderAlgorithmTree(listContainer, state, currentAlgorithmId, query, difficulty === 'all' ? null : difficulty);
    if (onFilter) onFilter(query, difficulty === 'all' ? null : difficulty);
  }

  searchInput.addEventListener('input', handleFilterChange);
  filterSelect.addEventListener('change', handleFilterChange);
}
