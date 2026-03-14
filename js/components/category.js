/**
 * Category View — renders a filtered list of algorithm cards
 * for a specific category.
 *
 * Each card shows the algorithm name, difficulty tag, and brief description.
 * Clicking a card navigates to #/algorithm/{id}.
 * Cards are keyboard accessible with ARIA labels.
 */

import { navigate } from '../router.js';
import { filterAlgorithms } from '../state.js';

/** Category display metadata keyed by slug */
const CATEGORY_META = {
  data_structures: { label: 'Data Structures', icon: '🗂️' },
  dynamic_programming: { label: 'Dynamic Programming', icon: '📊' },
  graph: { label: 'Graph', icon: '🔗' },
  mathematical: { label: 'Mathematical', icon: '🔢' },
  search: { label: 'Search', icon: '🔍' },
  sorting: { label: 'Sorting', icon: '📶' },
  string: { label: 'String', icon: '🔤' },
  tree: { label: 'Tree', icon: '🌳' },
};

/**
 * Maps a difficulty string to the corresponding CSS class suffix.
 * @param {string} difficulty
 * @returns {string}
 */
function difficultyClass(difficulty) {
  return `difficulty-${difficulty.toLowerCase()}`;
}

/**
 * Renders the category view into the given container element.
 * @param {HTMLElement} container
 * @param {import('../state.js').AppState} state
 * @param {string} category - Category slug (e.g., 'sorting')
 * @param {import('./progress.js').ProgressData} progress
 */
export function renderCategory(container, state, category, progress) {
  container.innerHTML = '';

  const meta = CATEGORY_META[category] || { label: category, icon: '📁' };
  const algorithms = filterAlgorithms(state, { category });

  // --- Header with back link ---
  const header = document.createElement('div');
  header.className = 'category-header';

  const backLink = document.createElement('a');
  backLink.href = '#/';
  backLink.className = 'back-link';
  backLink.textContent = '← Back to Home';
  backLink.setAttribute('aria-label', 'Back to Home');
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('#/');
  });
  header.appendChild(backLink);

  const heading = document.createElement('h1');
  heading.textContent = `${meta.icon} ${meta.label}`;
  header.appendChild(heading);

  container.appendChild(header);

  // --- Empty state ---
  if (algorithms.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'no-results';
    empty.textContent = 'No algorithms found in this category.';
    container.appendChild(empty);
    return;
  }

  // --- Card grid ---
  const grid = document.createElement('div');
  grid.className = 'card-grid';
  grid.setAttribute('role', 'list');
  grid.setAttribute('aria-label', `${meta.label} algorithms`);

  algorithms.forEach((algo) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute(
      'aria-label',
      `${algo.name}, ${algo.difficulty} difficulty. ${algo.description}`
    );

    // Navigate on click or Enter/Space
    const go = () => navigate(`#/algorithm/${algo.id}`);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });

    // Algorithm name
    const name = document.createElement('h2');
    name.className = 'card-title';
    name.textContent = algo.name;
    card.appendChild(name);

    // Difficulty tag
    const tag = document.createElement('span');
    tag.className = difficultyClass(algo.difficulty);
    tag.textContent = algo.difficulty;
    card.appendChild(tag);

    // Description
    const desc = document.createElement('p');
    desc.className = 'card-description';
    desc.textContent = algo.description;
    card.appendChild(desc);

    grid.appendChild(card);
  });

  container.appendChild(grid);
}
