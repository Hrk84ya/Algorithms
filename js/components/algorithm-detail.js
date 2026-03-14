/**
 * Algorithm Detail Page — orchestrates rendering of algorithm metadata,
 * code viewer, visualization panel, and exercise panel.
 *
 * Displays algorithm name, description, complexity badge, step-by-step
 * breakdown, and difficulty tag. Composes sub-components for code,
 * visualization, and exercises. Marks algorithm as visited on render.
 * Shows "Algorithm not found" with link to landing for invalid IDs.
 */

import { getAlgorithm } from '../state.js';
import { navigate } from '../router.js';
import { markVisited } from './progress.js';
import { renderCodeViewer } from './code-viewer.js';
import { renderVisualization } from './visualization.js';
import { renderExercises } from './exercise.js';

/**
 * Renders the algorithm detail page into the given container.
 * @param {HTMLElement} container
 * @param {import('../state.js').AppState} state
 * @param {string} algorithmId
 */
export function renderAlgorithmDetail(container, state, algorithmId) {
  container.innerHTML = '';

  const algo = getAlgorithm(state, algorithmId);

  if (!algo) {
    const wrapper = document.createElement('div');
    wrapper.className = 'algorithm-not-found';

    const msg = document.createElement('p');
    msg.textContent = 'Algorithm not found';
    wrapper.appendChild(msg);

    const link = document.createElement('a');
    link.href = '#/';
    link.textContent = '← Back to Home';
    link.setAttribute('aria-label', 'Back to Home');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('#/');
    });
    wrapper.appendChild(link);

    container.appendChild(wrapper);
    return;
  }

  // Mark as visited
  markVisited(algo.id);

  // --- Header: name + difficulty tag ---
  const header = document.createElement('div');
  header.className = 'algorithm-header';

  const heading = document.createElement('h1');
  heading.textContent = algo.name;
  header.appendChild(heading);

  const tag = document.createElement('span');
  tag.className = `difficulty-${algo.difficulty.toLowerCase()}`;
  tag.textContent = algo.difficulty;
  header.appendChild(tag);

  container.appendChild(header);

  // --- Description ---
  const desc = document.createElement('p');
  desc.className = 'algorithm-description';
  desc.textContent = algo.description;
  container.appendChild(desc);

  // --- Complexity badge ---
  if (algo.complexity) {
    const badge = document.createElement('div');
    badge.className = 'complexity-badge';
    badge.setAttribute('aria-label', 'Algorithm complexity');

    const entries = [
      ['Best', algo.complexity.timeBest],
      ['Average', algo.complexity.timeAverage],
      ['Worst', algo.complexity.timeWorst],
      ['Space', algo.complexity.space],
    ];

    entries.forEach(([label, value]) => {
      if (value) {
        const span = document.createElement('span');
        span.textContent = `${label}: ${value}`;
        badge.appendChild(span);
      }
    });

    container.appendChild(badge);
  }

  // --- Step-by-step breakdown ---
  if (Array.isArray(algo.steps) && algo.steps.length > 0) {
    const stepsSection = document.createElement('section');
    stepsSection.className = 'algorithm-steps';
    stepsSection.setAttribute('aria-label', 'Step-by-step breakdown');

    const stepsHeading = document.createElement('h2');
    stepsHeading.textContent = 'How It Works';
    stepsSection.appendChild(stepsHeading);

    const ol = document.createElement('ol');
    algo.steps.forEach((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    stepsSection.appendChild(ol);

    container.appendChild(stepsSection);
  }

  // --- Code viewer ---
  if (algo.paths) {
    const codeSection = document.createElement('section');
    codeSection.className = 'algorithm-code';
    codeSection.setAttribute('aria-label', 'Source code');

    const codeHeading = document.createElement('h2');
    codeHeading.textContent = 'Source Code';
    codeSection.appendChild(codeHeading);

    const codeContainer = document.createElement('div');
    codeSection.appendChild(codeContainer);
    renderCodeViewer(codeContainer, algo.paths);

    container.appendChild(codeSection);
  }

  // --- Visualization panel ---
  if (algo.visualization) {
    const vizSection = document.createElement('section');
    vizSection.className = 'algorithm-visualization';
    vizSection.setAttribute('aria-label', 'Algorithm visualization');

    const vizHeading = document.createElement('h2');
    vizHeading.textContent = 'Visualization';
    vizSection.appendChild(vizHeading);

    const vizPanel = document.createElement('div');
    vizPanel.className = 'visualization-panel';
    vizSection.appendChild(vizPanel);
    renderVisualization(vizPanel, algo);

    container.appendChild(vizSection);
  }

  // --- Exercise panel placeholder ---
  if (Array.isArray(algo.exercises) && algo.exercises.length > 0) {
    const exSection = document.createElement('section');
    exSection.className = 'algorithm-exercises';
    exSection.setAttribute('aria-label', 'Exercises');

    const exHeading = document.createElement('h2');
    exHeading.textContent = 'Exercises';
    exSection.appendChild(exHeading);

    const exPanel = document.createElement('div');
    exPanel.className = 'exercise-panel';
    renderExercises(exPanel, algo.exercises);
    exSection.appendChild(exPanel);

    container.appendChild(exSection);
  }
}
