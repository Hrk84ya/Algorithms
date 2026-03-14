/**
 * Sorting algorithm visualization renderer.
 * Exports computeSteps(data) and render(container, step) per the renderer interface.
 *
 * Supports: bubble-sort, insertion-sort, selection-sort, merge-sort, quick-sort, heap-sort
 */

/**
 * @typedef {Object} VisualizationStep
 * @property {number} stepIndex
 * @property {string} description
 * @property {Object} state
 * @property {number[]} highlighted
 */

/**
 * Generates step-by-step visualization states for sorting algorithms.
 * @param {{ array: number[], algorithm: string }} data
 * @returns {VisualizationStep[]}
 */
export function computeSteps(data) {
  const { array, algorithm } = data;
  if (!array || array.length === 0) {
    return [{ stepIndex: 0, description: 'Empty array — nothing to sort.', state: { array: [], sorted: [] }, highlighted: [] }];
  }

  const arr = [...array];
  const steps = [];
  const sorted = new Set();

  function snapshot(description, highlighted, action = 'compare') {
    steps.push({
      stepIndex: steps.length,
      description,
      state: { array: [...arr], sorted: [...sorted], action },
      highlighted: [...highlighted],
    });
  }

  // Initial state
  snapshot('Initial array', [], 'none');

  switch (algorithm) {
    case 'bubble-sort':
      bubbleSort(arr, snapshot, sorted);
      break;
    case 'insertion-sort':
      insertionSort(arr, snapshot, sorted);
      break;
    case 'selection-sort':
      selectionSort(arr, snapshot, sorted);
      break;
    case 'merge-sort':
      mergeSortDriver(arr, snapshot, sorted);
      break;
    case 'quick-sort':
      quickSortDriver(arr, snapshot, sorted);
      break;
    case 'heap-sort':
      heapSortDriver(arr, snapshot, sorted);
      break;
    default:
      // Fallback to bubble sort for unknown sorting algorithms
      bubbleSort(arr, snapshot, sorted);
      break;
  }

  // Final sorted state
  for (let i = 0; i < arr.length; i++) sorted.add(i);
  snapshot('Array is sorted!', [], 'done');

  return steps;
}

/* -----------------------------------------------------------------------
   Sorting algorithm implementations
   ----------------------------------------------------------------------- */

function bubbleSort(arr, snapshot, sorted) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      snapshot(`Comparing ${arr[j]} and ${arr[j + 1]}`, [j, j + 1], 'compare');
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        snapshot(`Swapped ${arr[j]} and ${arr[j + 1]}`, [j, j + 1], 'swap');
        swapped = true;
      }
    }
    sorted.add(n - 1 - i);
    if (!swapped) break;
  }
}

function insertionSort(arr, snapshot, sorted) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    snapshot(`Picking element ${key} at index ${i}`, [i], 'compare');
    while (j >= 0 && arr[j] > key) {
      snapshot(`Comparing ${arr[j]} > ${key}`, [j, j + 1], 'compare');
      arr[j + 1] = arr[j];
      snapshot(`Shifted ${arr[j + 1]} right`, [j, j + 1], 'swap');
      j--;
    }
    arr[j + 1] = key;
    snapshot(`Inserted ${key} at index ${j + 1}`, [j + 1], 'swap');
  }
}

function selectionSort(arr, snapshot, sorted) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      snapshot(`Comparing ${arr[j]} with current min ${arr[minIdx]}`, [minIdx, j], 'compare');
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      snapshot(`Swapped ${arr[i]} (index ${i}) with ${arr[minIdx]} (index ${minIdx})`, [i, minIdx], 'swap');
    }
    sorted.add(i);
  }
}

function mergeSortDriver(arr, snapshot, sorted) {
  mergeSortRecursive(arr, 0, arr.length - 1, snapshot);
}

function mergeSortRecursive(arr, left, right, snapshot) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  mergeSortRecursive(arr, left, mid, snapshot);
  mergeSortRecursive(arr, mid + 1, right, snapshot);
  merge(arr, left, mid, right, snapshot);
}

function merge(arr, left, mid, right, snapshot) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  snapshot(`Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`, [left, right], 'compare');

  while (i < leftArr.length && j < rightArr.length) {
    snapshot(`Comparing ${leftArr[i]} and ${rightArr[j]}`, [left + i, mid + 1 + j], 'compare');
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    snapshot(`Placed ${arr[k]} at index ${k}`, [k], 'swap');
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    snapshot(`Placed remaining ${arr[k]} at index ${k}`, [k], 'swap');
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    snapshot(`Placed remaining ${arr[k]} at index ${k}`, [k], 'swap');
    j++;
    k++;
  }
}

function quickSortDriver(arr, snapshot, sorted) {
  quickSortRecursive(arr, 0, arr.length - 1, snapshot, sorted);
}

function quickSortRecursive(arr, low, high, snapshot, sorted) {
  if (low >= high) {
    if (low === high) sorted.add(low);
    return;
  }
  const pivotIdx = partition(arr, low, high, snapshot);
  sorted.add(pivotIdx);
  snapshot(`Pivot ${arr[pivotIdx]} is in its final position at index ${pivotIdx}`, [pivotIdx], 'swap');
  quickSortRecursive(arr, low, pivotIdx - 1, snapshot, sorted);
  quickSortRecursive(arr, pivotIdx + 1, high, snapshot, sorted);
}

function partition(arr, low, high, snapshot) {
  const pivot = arr[high];
  snapshot(`Choosing pivot ${pivot} at index ${high}`, [high], 'compare');
  let i = low - 1;

  for (let j = low; j < high; j++) {
    snapshot(`Comparing ${arr[j]} with pivot ${pivot}`, [j, high], 'compare');
    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        snapshot(`Swapped ${arr[i]} and ${arr[j]}`, [i, j], 'swap');
      }
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  if (i + 1 !== high) {
    snapshot(`Placed pivot ${arr[i + 1]} at index ${i + 1}`, [i + 1, high], 'swap');
  }
  return i + 1;
}

function heapSortDriver(arr, snapshot, sorted) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, snapshot);
  }
  snapshot('Max heap built', [], 'compare');

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    snapshot(`Swapping root ${arr[0]} with ${arr[i]}`, [0, i], 'compare');
    [arr[0], arr[i]] = [arr[i], arr[0]];
    snapshot(`Moved ${arr[i]} to final position at index ${i}`, [0, i], 'swap');
    sorted.add(i);
    heapify(arr, i, 0, snapshot);
  }
}

function heapify(arr, n, i, snapshot) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    snapshot(`Comparing ${arr[left]} with ${arr[largest]}`, [left, largest], 'compare');
    if (arr[left] > arr[largest]) largest = left;
  }

  if (right < n) {
    snapshot(`Comparing ${arr[right]} with ${arr[largest]}`, [right, largest], 'compare');
    if (arr[right] > arr[largest]) largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    snapshot(`Swapped ${arr[i]} and ${arr[largest]}`, [i, largest], 'swap');
    heapify(arr, n, largest, snapshot);
  }
}

/* -----------------------------------------------------------------------
   Render function — draws bar chart with color-coded comparisons/swaps
   ----------------------------------------------------------------------- */

/**
 * Renders a single visualization step as a bar chart.
 * @param {HTMLElement} container
 * @param {VisualizationStep} step
 */
export function render(container, step) {
  const { array, sorted = [], action = 'none' } = step.state;
  const highlighted = new Set(step.highlighted || []);
  const sortedSet = new Set(sorted);

  container.innerHTML = '';

  if (array.length === 0) {
    container.textContent = 'No data to visualize.';
    return;
  }

  const maxVal = Math.max(...array);
  const wrapper = document.createElement('div');
  wrapper.className = 'viz-bars';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'flex-end';
  wrapper.style.gap = '2px';
  wrapper.style.height = '200px';
  wrapper.style.padding = '0.5rem 0';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', step.description);

  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement('div');
    const heightPct = maxVal > 0 ? (array[i] / maxVal) * 100 : 0;

    bar.className = 'viz-bar';
    if (sortedSet.has(i) && !highlighted.has(i)) {
      bar.classList.add('viz-bar-sorted');
    } else if (highlighted.has(i)) {
      bar.classList.add(action === 'swap' ? 'viz-bar-swap' : 'viz-bar-compare');
    }

    bar.style.flex = '1';
    bar.style.height = `${heightPct}%`;
    bar.style.minWidth = '4px';
    bar.style.position = 'relative';
    bar.setAttribute('aria-label', `Value ${array[i]}`);

    // Value label
    const label = document.createElement('span');
    label.className = 'viz-bar-label';
    label.textContent = array[i];
    label.style.position = 'absolute';
    label.style.top = '-1.25rem';
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.fontSize = '0.7rem';
    label.style.whiteSpace = 'nowrap';
    bar.appendChild(label);

    wrapper.appendChild(bar);
  }

  container.appendChild(wrapper);
}
