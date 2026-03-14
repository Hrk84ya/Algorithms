/**
 * Landing Page — renders category cards with algorithm counts,
 * progress indicators, difficulty filter, and a site tagline.
 *
 * Each category card navigates to #/category/{slug} on click.
 * Progress bars and exercise counts are driven by getProgressForCategory.
 * Difficulty filter controls let students narrow algorithms by level.
 */

import { navigate } from '../router.js';
import { getProgressForCategory } from './progress.js';
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

const DIFFICULTIES = ['all', 'Beginner', 'Intermediate', 'Advanced'];

/**
 * Renders the landing page into the given container element.
 * @param {HTMLElement} container
 * @param {import('../state.js').AppState} state
 * @param {import('./progress.js').ProgressData} progress
 */
export function renderLanding(container, state, progress) {
  container.innerHTML = '';

  // --- Tagline ---
  const tagline = document.createElement('section');
  tagline.className = 'landing-tagline';
  tagline.setAttribute('aria-label', 'Site introduction');

  const heading = document.createElement('h1');
  heading.textContent = 'Interactive Algorithm Learning';
  tagline.appendChild(heading);

  const subtitle = document.createElement('p');
  subtitle.textContent =
    'Explore algorithms through visualizations, code examples, and hands-on exercises. Pick a category to get started.';
  tagline.appendChild(subtitle);

  container.appendChild(tagline);

  // --- Difficulty filter ---
  const filterSection = document.createElement('div');
  filterSection.className = 'landing-filters';
  filterSection.setAttribute('role', 'group');
  filterSection.setAttribute('aria-label', 'Filter algorithms by difficulty');

  const filterLabel = document.createElement('span');
  filterLabel.textContent = 'Difficulty:';
  filterLabel.id = 'difficulty-filter-label';
  filterSection.appendChild(filterLabel);

  let activeDifficulty = 'all';

  DIFFICULTIES.forEach((level) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = level === 'all' ? 'All' : level;
    btn.className = 'btn difficulty-filter-btn';
    btn.setAttribute('aria-pressed', level === 'all' ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      level === 'all' ? 'Show all difficulties' : `Filter by ${level} difficulty`
    );

    if (level !== 'all') {
      btn.classList.add(`difficulty-${level.toLowerCase()}`);
    }
    if (level === 'all') {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      activeDifficulty = level;
      // Update pressed states
      filterSection.querySelectorAll('.difficulty-filter-btn').forEach((b) => {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('active');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('active');
      // Re-render cards
      renderCards(grid, state, progress, activeDifficulty);
    });

    filterSection.appendChild(btn);
  });

  container.appendChild(filterSection);

  // --- Card grid ---
  const grid = document.createElement('div');
  grid.className = 'card-grid';
  grid.setAttribute('role', 'list');
  grid.setAttribute('aria-label', 'Algorithm categories');
  container.appendChild(grid);

  renderCards(grid, state, progress, activeDifficulty);
}

/**
 * Renders category cards into the grid container.
 * @param {HTMLElement} grid
 * @param {import('../state.js').AppState} state
 * @param {import('./progress.js').ProgressData} progress
 * @param {string} difficulty - Active difficulty filter
 */
function renderCards(grid, state, progress, difficulty) {
  grid.innerHTML = '';

  state.categories.forEach((category) => {
    const filtered = filterAlgorithms(state, { category, difficulty });
    const totalInCategory = filterAlgorithms(state, { category }).length;
    const progressData = getProgressForCategory(state, category, progress);
    const meta = CATEGORY_META[category] || { label: category, icon: '📁' };

    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute(
      'aria-label',
      `${meta.label}: ${filtered.length} algorithms, ${progressData.visited} of ${totalInCategory} visited`
    );

    // Navigate on click or Enter/Space
    const go = () => navigate(`#/category/${category}`);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });

    // Icon + name
    const header = document.createElement('div');
    header.className = 'card-header';

    const icon = document.createElement('span');
    icon.className = 'card-icon';
    icon.textContent = meta.icon;
    icon.setAttribute('aria-hidden', 'true');
    header.appendChild(icon);

    const name = document.createElement('h2');
    name.className = 'card-title';
    name.textContent = meta.label;
    header.appendChild(name);

    card.appendChild(header);

    // Algorithm count
    const count = document.createElement('p');
    count.className = 'card-count';
    count.textContent =
      difficulty !== 'all'
        ? `${filtered.length} of ${totalInCategory} algorithms (${difficulty})`
        : `${filtered.length} algorithms`;
    card.appendChild(count);

    // Progress bar (visited / total)
    const progressLabel = document.createElement('p');
    progressLabel.className = 'card-progress-label';
    progressLabel.textContent = `${progressData.visited} / ${totalInCategory} visited`;
    card.appendChild(progressLabel);

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuenow', String(progressData.visited));
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', String(totalInCategory));
    progressBar.setAttribute(
      'aria-label',
      `${meta.label} progress: ${progressData.visited} of ${totalInCategory} visited`
    );

    const fill = document.createElement('div');
    fill.className = 'progress-bar-fill';
    const pct = totalInCategory > 0 ? (progressData.visited / totalInCategory) * 100 : 0;
    fill.style.width = `${pct}%`;
    progressBar.appendChild(fill);
    card.appendChild(progressBar);

    // Exercise completion
    const exercises = document.createElement('p');
    exercises.className = 'card-exercises';
    exercises.textContent = `Exercises: ${progressData.exercisesCompleted} / ${progressData.exercisesTotal} completed`;
    card.appendChild(exercises);

    grid.appendChild(card);
  });
}
