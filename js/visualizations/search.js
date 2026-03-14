/**
 * Search algorithm visualization renderer.
 * Exports computeSteps(data) and render(container, step) per the renderer interface.
 *
 * Supports: binary-search, linear-search
 */

/**
 * @typedef {Object} VisualizationStep
 * @property {number} stepIndex
 * @property {string} description
 * @property {Object} state
 * @property {number[]} highlighted
 */

/**
 * Generates step-by-step visualization states for search algorithms.
 * @param {{ array: number[], target: number, algorithm: string }} data
 * @returns {VisualizationStep[]}
 */
export function computeSteps(data) {
  const { array, target, algorithm } = data;
  if (!array || array.length === 0) {
    return [{
      stepIndex: 0,
      description: 'Empty array — nothing to search.',
      state: { array: [], target, found: false, action: 'none' },
      highlighted: [],
    }];
  }

  switch (algorithm) {
    case 'binary-search':
      return binarySearchSteps([...array], target);
    case 'linear-search':
      return linearSearchSteps([...array], target);
    default:
      return linearSearchSteps([...array], target);
  }
}

/* -----------------------------------------------------------------------
   Binary Search
   ----------------------------------------------------------------------- */

function binarySearchSteps(arr, target) {
  // Binary search requires a sorted array
  arr.sort((a, b) => a - b);

  const steps = [];

  function snapshot(description, highlighted, state) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: { array: [...arr], target, ...state },
      highlighted: [...highlighted],
    });
  }

  snapshot('Initial sorted array', [], {
    low: 0, high: arr.length - 1, mid: -1, found: false, action: 'none',
  });

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    snapshot(`Comparing middle element ${arr[mid]} (index ${mid}) with target ${target}`, [mid], {
      low, high, mid, found: false, action: 'compare',
    });

    if (arr[mid] === target) {
      snapshot(`Found target ${target} at index ${mid}!`, [mid], {
        low, high, mid, found: true, action: 'found',
      });
      return steps;
    } else if (arr[mid] < target) {
      snapshot(`${arr[mid]} < ${target}, narrowing to right half`, [mid], {
        low, high, mid, found: false, action: 'narrow',
      });
      low = mid + 1;
    } else {
      snapshot(`${arr[mid]} > ${target}, narrowing to left half`, [mid], {
        low, high, mid, found: false, action: 'narrow',
      });
      high = mid - 1;
    }
  }

  snapshot(`Target ${target} not found in array`, [], {
    low, high, mid: -1, found: false, action: 'not-found',
  });

  return steps;
}

/* -----------------------------------------------------------------------
   Linear Search
   ----------------------------------------------------------------------- */

function linearSearchSteps(arr, target) {
  const steps = [];

  function snapshot(description, highlighted, state) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: { array: [...arr], target, ...state },
      highlighted: [...highlighted],
    });
  }

  snapshot('Initial array', [], {
    currentIndex: -1, found: false, action: 'none',
  });

  for (let i = 0; i < arr.length; i++) {
    snapshot(`Checking element ${arr[i]} at index ${i}`, [i], {
      currentIndex: i, found: false, action: 'compare',
    });

    if (arr[i] === target) {
      snapshot(`Found target ${target} at index ${i}!`, [i], {
        currentIndex: i, found: true, action: 'found',
      });
      return steps;
    }
  }

  snapshot(`Target ${target} not found in array`, [], {
    currentIndex: arr.length, found: false, action: 'not-found',
  });

  return steps;
}

/* -----------------------------------------------------------------------
   Render function — draws array cells with pointer/highlight
   ----------------------------------------------------------------------- */

/**
 * Renders a single visualization step as an array of cells.
 * @param {HTMLElement} container
 * @param {VisualizationStep} step
 */
export function render(container, step) {
  const { array, action = 'none', found = false } = step.state;
  const highlighted = new Set(step.highlighted || []);

  container.innerHTML = '';

  if (!array || array.length === 0) {
    container.textContent = 'No data to visualize.';
    return;
  }

  // Determine eliminated indices (for binary search)
  const low = step.state.low;
  const high = step.state.high;
  const hasBounds = typeof low === 'number' && typeof high === 'number' && low >= 0;

  const wrapper = document.createElement('div');
  wrapper.className = 'viz-cells';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '4px';
  wrapper.style.padding = '1rem 0';
  wrapper.style.flexWrap = 'wrap';
  wrapper.style.justifyContent = 'center';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', step.description);

  for (let i = 0; i < array.length; i++) {
    const cell = document.createElement('div');
    cell.className = 'viz-cell';
    cell.style.width = '48px';
    cell.style.height = '48px';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';
    cell.style.border = '2px solid #ccc';
    cell.style.borderRadius = '4px';
    cell.style.fontWeight = 'bold';
    cell.style.position = 'relative';

    if (highlighted.has(i) && (action === 'found' || found)) {
      cell.classList.add('viz-cell-found');
    } else if (highlighted.has(i)) {
      cell.classList.add('viz-cell-active');
    } else if (hasBounds && (i < low || i > high)) {
      cell.classList.add('viz-cell-eliminated');
    }

    cell.textContent = array[i];
    cell.setAttribute('aria-label', `Value ${array[i]}`);

    wrapper.appendChild(cell);
  }

  container.appendChild(wrapper);
}
