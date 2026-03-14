/**
 * Visualization Panel — orchestrates the visualization engine and step controller UI.
 *
 * Dispatches step computation and rendering to type-specific renderer modules
 * (sorting, graph, search, tree, dp). Provides input validation, step controller
 * with play/pause/step/speed controls, ARIA live region for step descriptions,
 * and responsive scaling for mobile viewports.
 */

import * as sortingRenderer from '../visualizations/sorting.js';
import * as graphRenderer from '../visualizations/graph.js';
import * as searchRenderer from '../visualizations/search.js';
import * as treeRenderer from '../visualizations/tree.js';
import * as dpRenderer from '../visualizations/dp.js';

/* --------------------------------------------------------------------------
   Renderer Registry
   -------------------------------------------------------------------------- */
const renderers = {
  sorting: sortingRenderer,
  graph: graphRenderer,
  search: searchRenderer,
  tree: treeRenderer,
  dp: dpRenderer,
};

/* --------------------------------------------------------------------------
   Input Validators
   Each returns { valid: boolean, data: any, error: string }
   -------------------------------------------------------------------------- */
const validators = {
  integerList(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, data: null, error: 'Input is required. Expected format: comma-separated integers (e.g. 64, 34, 25, 12)' };
    }
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) {
      return { valid: false, data: null, error: 'No values provided. Expected format: comma-separated integers (e.g. 64, 34, 25, 12)' };
    }
    if (parts.length > 20) {
      return { valid: false, data: null, error: 'Too many elements (max 20). Expected format: comma-separated integers (e.g. 64, 34, 25, 12)' };
    }
    const nums = [];
    for (const p of parts) {
      if (!/^-?\d+$/.test(p)) {
        return { valid: false, data: null, error: `"${p}" is not a valid integer. Expected format: comma-separated integers (e.g. 64, 34, 25, 12)` };
      }
      nums.push(parseInt(p, 10));
    }
    return { valid: true, data: nums, error: '' };
  },

  positiveIntegerList(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, data: null, error: 'Input is required. Expected format: comma-separated positive integers (e.g. 1, 5, 10, 25)' };
    }
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) {
      return { valid: false, data: null, error: 'No values provided. Expected format: comma-separated positive integers (e.g. 1, 5, 10, 25)' };
    }
    if (parts.length > 20) {
      return { valid: false, data: null, error: 'Too many elements (max 20). Expected format: comma-separated positive integers (e.g. 1, 5, 10, 25)' };
    }
    const nums = [];
    for (const p of parts) {
      if (!/^\d+$/.test(p) || parseInt(p, 10) <= 0) {
        return { valid: false, data: null, error: `"${p}" is not a positive integer. Expected format: comma-separated positive integers (e.g. 1, 5, 10, 25)` };
      }
      nums.push(parseInt(p, 10));
    }
    return { valid: true, data: nums, error: '' };
  },

  positiveInteger(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, data: null, error: 'Input is required. Expected format: a single positive integer (e.g. 36)' };
    }
    if (!/^\d+$/.test(trimmed) || parseInt(trimmed, 10) <= 0) {
      return { valid: false, data: null, error: `"${trimmed}" is not a positive integer. Expected format: a single positive integer (e.g. 36)` };
    }
    return { valid: true, data: parseInt(trimmed, 10), error: '' };
  },

  edgeList(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, data: null, error: 'Input is required. Expected format: edge pairs like 0-1, 1-2, 2-3' };
    }
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) {
      return { valid: false, data: null, error: 'No edges provided. Expected format: edge pairs like 0-1, 1-2, 2-3' };
    }
    for (const p of parts) {
      if (!/^\d+\s*-\s*\d+$/.test(p)) {
        return { valid: false, data: null, error: `"${p}" is not a valid edge. Expected format: edge pairs like 0-1, 1-2, 2-3` };
      }
    }
    return { valid: true, data: trimmed, error: '' };
  },

  stringPair(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, data: null, error: 'Input is required. Expected format: two strings separated by a comma (e.g. ABCBDAB, BDCAB)' };
    }
    const parts = trimmed.split(',').map(s => s.trim());
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { valid: false, data: null, error: 'Please provide exactly two strings separated by a comma. Expected format: two strings (e.g. ABCBDAB, BDCAB)' };
    }
    return { valid: true, data: parts, error: '' };
  },
};

/**
 * Validates input for a given validation type.
 * @param {string} validationType - One of: integerList, positiveIntegerList, positiveInteger, edgeList, stringPair
 * @param {string} value - Raw string input
 * @returns {{ valid: boolean, data: any, error: string }}
 */
export function validateInput(validationType, value) {
  const validator = validators[validationType];
  if (!validator) {
    return { valid: false, data: null, error: `Unknown validation type: "${validationType}"` };
  }
  return validator(value);
}

/* --------------------------------------------------------------------------
   computeSteps dispatcher
   -------------------------------------------------------------------------- */

/**
 * Dispatches to the correct renderer's computeSteps based on algorithm's visualization type.
 * @param {Object} algorithm - Full algorithm manifest entry
 * @param {any} inputData - Parsed input data to pass to the renderer
 * @returns {import('../visualizations/sorting.js').VisualizationStep[]}
 */
export function computeSteps(algorithm, inputData) {
  const vizType = algorithm.visualization && algorithm.visualization.type;
  const renderer = renderers[vizType];
  if (!renderer) {
    return [{ stepIndex: 0, description: `No renderer for visualization type "${vizType}".`, state: {}, highlighted: [] }];
  }
  return renderer.computeSteps(inputData);
}

/* --------------------------------------------------------------------------
   Step Controller
   -------------------------------------------------------------------------- */

/**
 * Creates the step controller UI with play/pause/step/speed controls.
 * @param {Object} options
 * @param {() => void} options.onPlay
 * @param {() => void} options.onPause
 * @param {() => void} options.onStepForward
 * @param {() => void} options.onStepBack
 * @param {(speed: number) => void} options.onSpeedChange
 * @returns {{ element: HTMLElement, updateState: (state: Object) => void, destroy: () => void }}
 */
export function createStepController({ onPlay, onPause, onStepForward, onStepBack, onSpeedChange }) {
  const container = document.createElement('div');
  container.className = 'step-controller';

  // Step Backward
  const backBtn = document.createElement('button');
  backBtn.className = 'btn';
  backBtn.textContent = '⏮';
  backBtn.setAttribute('aria-label', 'Step backward');
  backBtn.addEventListener('click', onStepBack);

  // Play
  const playBtn = document.createElement('button');
  playBtn.className = 'btn';
  playBtn.textContent = '▶';
  playBtn.setAttribute('aria-label', 'Play');
  playBtn.addEventListener('click', onPlay);

  // Pause
  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'btn';
  pauseBtn.textContent = '⏸';
  pauseBtn.setAttribute('aria-label', 'Pause');
  pauseBtn.addEventListener('click', onPause);

  // Step Forward
  const fwdBtn = document.createElement('button');
  fwdBtn.className = 'btn';
  fwdBtn.textContent = '⏭';
  fwdBtn.setAttribute('aria-label', 'Step forward');
  fwdBtn.addEventListener('click', onStepForward);

  // Speed slider
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Speed: ';
  speedLabel.setAttribute('for', 'viz-speed-slider');

  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.id = 'viz-speed-slider';
  speedSlider.className = 'speed-slider';
  speedSlider.min = '100';
  speedSlider.max = '2000';
  speedSlider.value = '500';
  speedSlider.setAttribute('aria-label', 'Animation speed');
  speedSlider.setAttribute('aria-valuemin', '100');
  speedSlider.setAttribute('aria-valuemax', '2000');
  speedSlider.setAttribute('aria-valuenow', '500');
  speedSlider.addEventListener('input', () => {
    const val = parseInt(speedSlider.value, 10);
    speedSlider.setAttribute('aria-valuenow', String(val));
    onSpeedChange(val);
  });
  speedLabel.appendChild(speedSlider);

  // Step counter
  const stepCounter = document.createElement('span');
  stepCounter.className = 'step-counter';
  stepCounter.setAttribute('aria-live', 'polite');
  stepCounter.textContent = 'Step 0 of 0';

  container.appendChild(backBtn);
  container.appendChild(playBtn);
  container.appendChild(pauseBtn);
  container.appendChild(fwdBtn);
  container.appendChild(speedLabel);
  container.appendChild(stepCounter);

  function updateState(state) {
    stepCounter.textContent = `Step ${state.currentStep + 1} of ${state.totalSteps}`;
    playBtn.disabled = state.isPlaying;
    pauseBtn.disabled = !state.isPlaying;
    backBtn.disabled = state.currentStep <= 0;
    fwdBtn.disabled = state.currentStep >= state.totalSteps - 1;
    if (state.speed !== undefined) {
      speedSlider.value = String(state.speed);
      speedSlider.setAttribute('aria-valuenow', String(state.speed));
    }
  }

  function destroy() {
    backBtn.removeEventListener('click', onStepBack);
    playBtn.removeEventListener('click', onPlay);
    pauseBtn.removeEventListener('click', onPause);
    fwdBtn.removeEventListener('click', onStepForward);
  }

  return { element: container, updateState, destroy };
}

/* --------------------------------------------------------------------------
   renderVisualization — main entry point
   -------------------------------------------------------------------------- */

/**
 * Renders the full visualization panel for an algorithm.
 * @param {HTMLElement} container - The DOM element to render into
 * @param {Object} algorithm - Full algorithm manifest entry
 */
export function renderVisualization(container, algorithm) {
  container.innerHTML = '';

  const viz = algorithm.visualization;
  if (!viz) {
    container.textContent = 'No visualization available for this algorithm.';
    return;
  }

  const renderer = renderers[viz.type];
  if (!renderer) {
    container.textContent = `No renderer available for visualization type "${viz.type}".`;
    return;
  }

  // --- State ---
  let steps = [];
  let currentStep = 0;
  let isPlaying = false;
  let speed = 500;
  let intervalId = null;

  // --- Input fields ---
  const inputSection = document.createElement('div');
  inputSection.className = 'visualization-input';
  inputSection.style.marginBottom = '1rem';

  const inputFields = {};
  const errorElements = {};

  if (Array.isArray(viz.inputFields)) {
    viz.inputFields.forEach((field) => {
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '0.5rem';

      const label = document.createElement('label');
      label.textContent = field.label + ': ';
      label.setAttribute('for', `viz-input-${field.name}`);

      const input = document.createElement('input');
      input.type = 'text';
      input.id = `viz-input-${field.name}`;
      input.placeholder = field.placeholder || '';
      input.setAttribute('aria-label', field.label);

      // Pre-fill with default input
      if (viz.defaultInput != null) {
        const defaultVal = typeof viz.defaultInput === 'object' && !Array.isArray(viz.defaultInput)
          ? viz.defaultInput[field.name]
          : viz.defaultInput;
        if (defaultVal != null) {
          input.value = Array.isArray(defaultVal) ? defaultVal.join(', ') : String(defaultVal);
        }
      }

      inputFields[field.name] = { input, validation: field.validation };

      const errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      errorEl.style.display = 'none';
      errorEl.style.padding = '0.25rem 0.5rem';
      errorEl.style.marginTop = '0.25rem';
      errorEl.style.fontSize = '0.8125rem';
      errorEl.setAttribute('role', 'alert');
      errorElements[field.name] = errorEl;

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      wrapper.appendChild(errorEl);
      inputSection.appendChild(wrapper);
    });
  }

  // Run button
  const runBtn = document.createElement('button');
  runBtn.className = 'btn btn-primary';
  runBtn.textContent = 'Run';
  runBtn.setAttribute('aria-label', 'Run visualization');
  inputSection.appendChild(runBtn);

  container.appendChild(inputSection);

  // --- Visualization canvas ---
  const vizCanvas = document.createElement('div');
  vizCanvas.className = 'visualization-canvas';
  vizCanvas.style.minHeight = '120px';
  vizCanvas.setAttribute('role', 'img');
  vizCanvas.setAttribute('aria-label', 'Algorithm visualization display');
  container.appendChild(vizCanvas);

  // --- ARIA live region ---
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');
  liveRegion.className = 'sr-only';
  container.appendChild(liveRegion);

  // --- Step controller ---
  const controller = createStepController({
    onPlay: startPlayback,
    onPause: stopPlayback,
    onStepForward: stepForward,
    onStepBack: stepBackward,
    onSpeedChange: (newSpeed) => {
      speed = newSpeed;
      if (isPlaying) {
        stopPlayback();
        startPlayback();
      }
    },
  });
  container.appendChild(controller.element);

  // --- Responsive scaling ---
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  function applyResponsive() {
    if (mediaQuery.matches) {
      vizCanvas.style.maxWidth = '100%';
      vizCanvas.style.overflowX = 'auto';
    } else {
      vizCanvas.style.maxWidth = '';
      vizCanvas.style.overflowX = '';
    }
  }
  applyResponsive();
  mediaQuery.addEventListener('change', applyResponsive);

  // --- Helpers ---
  function renderCurrentStep() {
    if (steps.length === 0) return;
    const step = steps[currentStep];
    renderer.render(vizCanvas, step);
    liveRegion.textContent = step.description;
    controller.updateState({ currentStep, totalSteps: steps.length, isPlaying, speed });
  }

  function stepForward() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderCurrentStep();
    }
    if (currentStep >= steps.length - 1) {
      stopPlayback();
    }
  }

  function stepBackward() {
    if (currentStep > 0) {
      currentStep--;
      renderCurrentStep();
    }
  }

  function startPlayback() {
    if (isPlaying) return;
    if (currentStep >= steps.length - 1) return;
    isPlaying = true;
    controller.updateState({ currentStep, totalSteps: steps.length, isPlaying, speed });
    intervalId = setInterval(() => {
      stepForward();
    }, speed);
  }

  function stopPlayback() {
    isPlaying = false;
    if (intervalId != null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    controller.updateState({ currentStep, totalSteps: steps.length, isPlaying, speed });
  }

  function runVisualization() {
    // Validate all inputs
    let hasError = false;
    const parsedData = {};

    for (const [name, fieldInfo] of Object.entries(inputFields)) {
      const { input, validation } = fieldInfo;
      const result = validateInput(validation, input.value);
      const errorEl = errorElements[name];

      if (!result.valid) {
        hasError = true;
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      } else {
        errorEl.style.display = 'none';
        parsedData[name] = result.data;
      }
    }

    if (hasError) return;

    // Stop any current playback
    stopPlayback();

    // Build input data for the renderer
    const inputData = { ...parsedData, algorithm: algorithm.id };

    // Compute steps
    steps = computeSteps(algorithm, inputData);
    currentStep = 0;
    renderCurrentStep();
  }

  // Wire up run button
  runBtn.addEventListener('click', runVisualization);

  // Auto-run with default input on load
  runVisualization();
}
