/**
 * App entry point — initializes theme, state, progress, and router.
 * Wires all components into the route change handler: landing page,
 * category view, and algorithm detail with navigation sidebar.
 *
 * Handles manifest fetch failure with full-page error + retry,
 * missing algorithm IDs, and unhandled promise rejections.
 * The UI never shows a blank screen on any error.
 */

import { initState, filterAlgorithms } from './state.js';
import { initTheme, toggleTheme } from './components/theme.js';
import { loadProgress } from './components/progress.js';
import { onRouteChange, parseRoute } from './router.js';
import { renderLanding } from './components/landing.js';
import { renderCategory } from './components/category.js';
import { renderAlgorithmDetail } from './components/algorithm-detail.js';
import { renderNavigation, initNavigationFilters } from './components/navigation.js';

const app = document.getElementById('app');
const sidebar = document.getElementById('sidebar');

/** Currently active route change handler (so we can remove it on retry). */
let removeHashListener = null;

/**
 * Renders the appropriate view based on the current route.
 * @param {import('./router.js').Route} route
 * @param {import('./state.js').AppState} state
 */
function renderView(route, state) {
  const progress = loadProgress();

  switch (route.view) {
    case 'landing':
      if (sidebar) sidebar.innerHTML = '';
      renderLanding(app, state, progress);
      break;

    case 'category':
      if (sidebar) sidebar.innerHTML = '';
      renderCategory(app, state, route.category, progress);
      break;

    case 'algorithm':
      renderAlgorithmDetail(app, state, route.algorithmId);
      if (sidebar) {
        renderNavigation(sidebar, state, route.algorithmId);
        initNavigationFilters(state, route.algorithmId);
      }
      break;

    default:
      if (sidebar) sidebar.innerHTML = '';
      renderLanding(app, state, progress);
  }
}

/**
 * Shows a full-page error message with a retry button.
 * @param {string} message
 */
function showError(message) {
  app.innerHTML = '';
  if (sidebar) sidebar.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'error-page';
  wrapper.setAttribute('role', 'alert');

  const msg = document.createElement('p');
  msg.className = 'error-message';
  msg.textContent = message;
  wrapper.appendChild(msg);

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'btn retry-btn';
  retryBtn.textContent = 'Retry';
  retryBtn.setAttribute('aria-label', 'Retry loading');
  retryBtn.addEventListener('click', () => boot());
  wrapper.appendChild(retryBtn);

  app.appendChild(wrapper);
}

async function boot() {
  // Clean up previous hash listener if retrying
  if (removeHashListener) {
    removeHashListener();
    removeHashListener = null;
  }

  // Apply saved / system theme immediately
  initTheme();

  // Wire up theme toggle button (clone to remove old listeners on retry)
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const freshBtn = themeBtn.cloneNode(true);
    themeBtn.parentNode.replaceChild(freshBtn, themeBtn);
    freshBtn.addEventListener('click', toggleTheme);
  }

  // Wire up mobile nav toggle (clone to remove old listeners on retry)
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    const freshNav = navToggle.cloneNode(true);
    navToggle.parentNode.replaceChild(freshNav, navToggle);
    freshNav.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('sidebar-open');
      freshNav.setAttribute('aria-expanded', String(isOpen));
    });
    // Allow Escape key to close the sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
        document.body.classList.remove('sidebar-open');
        freshNav.setAttribute('aria-expanded', 'false');
        freshNav.focus();
      }
    });
  }

  // Show loading state
  app.textContent = 'Loading…';

  // Fetch manifest
  const state = await initState();

  if (state.error) {
    showError('Unable to load algorithm data. Please check your connection and try again.');
    return;
  }

  // Set up route-based rendering
  const handler = () => {
    const route = parseRoute(window.location.hash);
    renderView(route, state);
  };

  window.addEventListener('hashchange', handler);
  removeHashListener = () => window.removeEventListener('hashchange', handler);

  // Render the initial route
  handler();
}

// Catch unhandled promise rejections at the app level
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

boot();
