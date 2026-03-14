/**
 * Tree algorithm visualization renderer.
 * Exports computeSteps(data) and render(container, step) per the renderer interface.
 *
 * Supports: binary-search-tree (insertion), min-heap (insertion), binary-tree-traversal (in-order)
 */

/**
 * @typedef {Object} VisualizationStep
 * @property {number} stepIndex
 * @property {string} description
 * @property {Object} state
 * @property {number[]} highlighted
 */

/**
 * Generates step-by-step visualization states for tree algorithms.
 * @param {{ array: number[], algorithm: string }} data
 * @returns {VisualizationStep[]}
 */
export function computeSteps(data) {
  const { array, algorithm } = data;
  if (!array || array.length === 0) {
    return [{
      stepIndex: 0,
      description: 'Empty input — nothing to visualize.',
      state: { tree: null, action: 'none' },
      highlighted: [],
    }];
  }

  switch (algorithm) {
    case 'binary-search-tree':
      return bstInsertionSteps(array);
    case 'min-heap':
      return minHeapSteps(array);
    case 'binary-tree-traversal':
      return bstTraversalSteps(array);
    default:
      return bstInsertionSteps(array);
  }
}

/* -----------------------------------------------------------------------
   BST helpers
   ----------------------------------------------------------------------- */

function cloneTree(node) {
  if (!node) return null;
  return { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function bstInsert(root, value) {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) {
    root.left = bstInsert(root.left, value);
  } else {
    root.right = bstInsert(root.right, value);
  }
  return root;
}

/* -----------------------------------------------------------------------
   BST Insertion Steps
   ----------------------------------------------------------------------- */

function bstInsertionSteps(array) {
  const steps = [];
  let root = null;

  function snapshot(description, highlighted, action) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: { tree: cloneTree(root), action },
      highlighted: [...highlighted],
    });
  }

  snapshot('Empty tree', [], 'none');

  for (const value of array) {
    // Show comparison path
    let current = root;
    const path = [];
    while (current) {
      path.push(current.value);
      if (value < current.value) {
        snapshot(`Comparing ${value} < ${current.value}, go left`, path, 'compare');
        current = current.left;
      } else {
        snapshot(`Comparing ${value} >= ${current.value}, go right`, path, 'compare');
        current = current.right;
      }
    }

    root = bstInsert(root, value);
    snapshot(`Inserted ${value}`, [value], 'insert');
  }

  snapshot('BST construction complete!', [], 'done');
  return steps;
}

/* -----------------------------------------------------------------------
   Min-Heap Insertion Steps
   ----------------------------------------------------------------------- */

function minHeapSteps(array) {
  const steps = [];
  const heap = [];

  function snapshot(description, highlighted, action) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: { tree: [...heap], action },
      highlighted: [...highlighted],
    });
  }

  snapshot('Empty heap', [], 'none');

  for (const value of array) {
    heap.push(value);
    let idx = heap.length - 1;
    snapshot(`Added ${value} at index ${idx}`, [idx], 'insert');

    // Heapify up
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      snapshot(`Comparing ${heap[idx]} with parent ${heap[parentIdx]}`, [idx, parentIdx], 'compare');
      if (heap[idx] < heap[parentIdx]) {
        [heap[idx], heap[parentIdx]] = [heap[parentIdx], heap[idx]];
        snapshot(`Swapped ${heap[parentIdx]} and ${heap[idx]}`, [idx, parentIdx], 'insert');
        idx = parentIdx;
      } else {
        snapshot(`${heap[idx]} >= ${heap[parentIdx]}, heap property satisfied`, [idx], 'compare');
        break;
      }
    }
  }

  snapshot('Min-heap construction complete!', [], 'done');
  return steps;
}

/* -----------------------------------------------------------------------
   BST Traversal Steps (in-order)
   ----------------------------------------------------------------------- */

function bstTraversalSteps(array) {
  const steps = [];

  // Build BST first
  let root = null;
  for (const value of array) {
    root = bstInsert(root, value);
  }

  function snapshot(description, highlighted, action) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: { tree: cloneTree(root), action },
      highlighted: [...highlighted],
    });
  }

  snapshot('BST built, starting in-order traversal', [], 'none');

  const visited = [];

  function inOrder(node) {
    if (!node) return;
    inOrder(node.left);
    snapshot(`Visiting node ${node.value}`, [node.value], 'visit');
    visited.push(node.value);
    snapshot(`Visited: [${visited.join(', ')}]`, [...visited], 'visit');
    inOrder(node.right);
  }

  inOrder(root);
  snapshot('In-order traversal complete!', [...visited], 'done');
  return steps;
}

/* -----------------------------------------------------------------------
   Render function — draws SVG tree node diagram
   ----------------------------------------------------------------------- */

/**
 * Computes layout positions for a binary tree (object form).
 * Returns a flat array of { value, x, y, parentX, parentY }.
 */
function layoutBinaryTree(root, width, height) {
  if (!root) return [];
  const nodes = [];
  const nodeRadius = 20;
  const topMargin = 30;
  const levelHeight = 60;

  function traverse(node, depth, left, right) {
    if (!node) return;
    const x = (left + right) / 2;
    const y = topMargin + depth * levelHeight;
    nodes.push({ value: node.value, x, y, left: node.left, right: node.right });
    traverse(node.left, depth + 1, left, x);
    traverse(node.right, depth + 1, x, right);
  }

  traverse(root, 0, 0, width);
  return nodes;
}

/**
 * Computes layout positions for a heap (array form) as a binary tree.
 * Returns a flat array of { value, x, y, parentIdx }.
 */
function layoutHeapTree(heap, width) {
  if (!heap || heap.length === 0) return [];
  const nodes = [];
  const topMargin = 30;
  const levelHeight = 60;

  // Compute depth of the heap tree
  const depth = Math.floor(Math.log2(heap.length)) + 1;

  for (let i = 0; i < heap.length; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const spacing = width / (nodesInLevel + 1);
    const x = spacing * (posInLevel + 1);
    const y = topMargin + level * levelHeight;
    const parentIdx = i > 0 ? Math.floor((i - 1) / 2) : -1;
    nodes.push({ value: heap[i], x, y, index: i, parentIdx });
  }

  return nodes;
}

/**
 * Renders a single visualization step as an SVG tree diagram.
 * @param {HTMLElement} container
 * @param {VisualizationStep} step
 */
export function render(container, step) {
  const { tree, action = 'none' } = step.state;
  const highlighted = new Set(step.highlighted || []);

  container.innerHTML = '';

  if (tree === null || (Array.isArray(tree) && tree.length === 0)) {
    container.textContent = 'No tree data to visualize.';
    return;
  }

  const width = 400;
  const isHeap = Array.isArray(tree);
  const nodes = isHeap ? layoutHeapTree(tree, width) : layoutBinaryTree(tree, width, 300);

  if (nodes.length === 0) {
    container.textContent = 'No tree data to visualize.';
    return;
  }

  // Calculate height based on deepest node
  const maxY = Math.max(...nodes.map(n => n.y));
  const height = maxY + 50;
  const nodeRadius = 20;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', step.description);
  svg.style.maxWidth = `${width}px`;
  svg.style.maxHeight = `${height}px`;

  // Draw edges first
  if (isHeap) {
    for (const node of nodes) {
      if (node.parentIdx >= 0) {
        const parent = nodes[node.parentIdx];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parent.x);
        line.setAttribute('y1', parent.y);
        line.setAttribute('x2', node.x);
        line.setAttribute('y2', node.y);
        line.setAttribute('class', 'viz-tree-edge');
        line.setAttribute('stroke', '#999');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    }
  } else {
    // BST: draw edges by traversing layout nodes
    const nodeMap = new Map();
    for (const n of nodes) {
      nodeMap.set(n.value, n);
    }
    for (const n of nodes) {
      if (n.left) {
        const child = nodeMap.get(n.left.value);
        if (child) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', n.x);
          line.setAttribute('y1', n.y);
          line.setAttribute('x2', child.x);
          line.setAttribute('y2', child.y);
          line.setAttribute('class', 'viz-tree-edge');
          line.setAttribute('stroke', '#999');
          line.setAttribute('stroke-width', '2');
          svg.appendChild(line);
        }
      }
      if (n.right) {
        const child = nodeMap.get(n.right.value);
        if (child) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', n.x);
          line.setAttribute('y1', n.y);
          line.setAttribute('x2', child.x);
          line.setAttribute('y2', child.y);
          line.setAttribute('class', 'viz-tree-edge');
          line.setAttribute('stroke', '#999');
          line.setAttribute('stroke-width', '2');
          svg.appendChild(line);
        }
      }
    }
  }

  // Draw nodes
  for (const node of nodes) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const isHighlighted = isHeap
      ? highlighted.has(node.index)
      : highlighted.has(node.value);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', nodeRadius);

    let nodeClass = 'viz-tree-node';
    if (isHighlighted && (action === 'visit' || action === 'done')) {
      nodeClass += ' viz-tree-node-visited';
    } else if (isHighlighted) {
      nodeClass += ' viz-tree-node-active';
    }
    circle.setAttribute('class', nodeClass);

    // Color based on highlight state
    let fill = '#ecf0f1';
    if (isHighlighted && (action === 'visit' || action === 'done')) {
      fill = '#27ae60';
    } else if (isHighlighted) {
      fill = '#e74c3c';
    }
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', isHighlighted ? '#2c3e50' : '#7f8c8d');
    circle.setAttribute('stroke-width', isHighlighted ? '3' : '1.5');

    g.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', isHighlighted ? '#fff' : '#2c3e50');
    text.textContent = node.value;

    g.appendChild(text);
    g.setAttribute('aria-label', `Node ${node.value}`);

    svg.appendChild(g);
  }

  container.appendChild(svg);
}
