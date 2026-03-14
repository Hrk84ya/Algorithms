/**
 * Graph algorithm visualization renderer.
 * Exports computeSteps(data) and render(container, step) per the renderer interface.
 *
 * Supports: breadth-first-search, depth-first-search, dijkstra-algorithm,
 *           bellman-ford, floyd-warshall, kruskal-algorithm, prim-algorithm
 */

/**
 * @typedef {Object} VisualizationStep
 * @property {number} stepIndex
 * @property {string} description
 * @property {Object} state
 * @property {number[]} highlighted
 */

/**
 * Parses an edge list string into an adjacency list and a list of edge objects.
 * @param {string} edgesStr - e.g. "0-1, 0-2, 1-3"
 * @returns {{ adjacency: Map<number, number[]>, edgeList: Array<{from: number, to: number}>, nodeSet: Set<number> }}
 */
function parseEdges(edgesStr) {
  const adjacency = new Map();
  const edgeList = [];
  const nodeSet = new Set();

  const pairs = edgesStr.split(',').map(s => s.trim()).filter(Boolean);
  for (const pair of pairs) {
    const [aStr, bStr] = pair.split('-').map(s => s.trim());
    const a = parseInt(aStr, 10);
    const b = parseInt(bStr, 10);
    if (isNaN(a) || isNaN(b)) continue;

    nodeSet.add(a);
    nodeSet.add(b);
    edgeList.push({ from: a, to: b });

    if (!adjacency.has(a)) adjacency.set(a, []);
    if (!adjacency.has(b)) adjacency.set(b, []);
    adjacency.get(a).push(b);
    adjacency.get(b).push(a);
  }

  return { adjacency, edgeList, nodeSet };
}

/**
 * Builds the initial state snapshot for a graph.
 * @param {Set<number>} nodeSet
 * @param {Array<{from: number, to: number}>} edgeList
 * @returns {{ nodes: Array<{id: number, status: string}>, edges: Array<{from: number, to: number, status: string}> }}
 */
function buildInitialState(nodeSet, edgeList) {
  const nodes = [...nodeSet].sort((a, b) => a - b).map(id => ({ id, status: 'unvisited' }));
  const edges = edgeList.map(e => ({ from: e.from, to: e.to, status: 'normal' }));
  return { nodes, edges };
}

/**
 * Deep-clones a graph state for snapshotting.
 */
function cloneState(state) {
  return {
    nodes: state.nodes.map(n => ({ ...n })),
    edges: state.edges.map(e => ({ ...e })),
    currentNode: state.currentNode,
  };
}

/**
 * Sets a node's status in the state.
 */
function setNodeStatus(state, nodeId, status) {
  const node = state.nodes.find(n => n.id === nodeId);
  if (node) node.status = status;
}

/**
 * Sets an edge's status in the state (undirected — matches either direction).
 */
function setEdgeStatus(state, from, to, status) {
  for (const e of state.edges) {
    if ((e.from === from && e.to === to) || (e.from === to && e.to === from)) {
      e.status = status;
    }
  }
}

/**
 * Generates step-by-step visualization states for graph algorithms.
 * @param {{ edges: string, start: number, algorithm: string }} data
 * @returns {VisualizationStep[]}
 */
export function computeSteps(data) {
  const { edges: edgesStr, start, algorithm } = data;
  if (!edgesStr || edgesStr.trim() === '') {
    return [{
      stepIndex: 0,
      description: 'No edges provided — nothing to visualize.',
      state: { nodes: [], edges: [], currentNode: null },
      highlighted: [],
    }];
  }

  const { adjacency, edgeList, nodeSet } = parseEdges(edgesStr);

  if (nodeSet.size === 0) {
    return [{
      stepIndex: 0,
      description: 'No valid nodes found.',
      state: { nodes: [], edges: [], currentNode: null },
      highlighted: [],
    }];
  }

  const initial = buildInitialState(nodeSet, edgeList);
  initial.currentNode = null;

  const steps = [];

  function snapshot(description, highlighted) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: cloneState(initial),
      highlighted: [...highlighted],
    });
  }

  // Initial state
  snapshot('Initial graph', []);

  switch (algorithm) {
    case 'breadth-first-search':
      bfs(initial, adjacency, start, snapshot);
      break;
    case 'depth-first-search':
      dfs(initial, adjacency, start, snapshot);
      break;
    case 'dijkstra-algorithm':
      dijkstra(initial, adjacency, start, snapshot);
      break;
    case 'bellman-ford':
      bellmanFord(initial, adjacency, edgeList, start, snapshot);
      break;
    case 'floyd-warshall':
      floydWarshall(initial, adjacency, nodeSet, edgeList, snapshot);
      break;
    case 'kruskal-algorithm':
      kruskal(initial, nodeSet, edgeList, snapshot);
      break;
    case 'prim-algorithm':
      prim(initial, adjacency, nodeSet, edgeList, start, snapshot);
      break;
    default:
      // Fallback to BFS
      bfs(initial, adjacency, start, snapshot);
      break;
  }

  // Final state
  snapshot('Algorithm complete!', []);

  return steps;
}

/* -----------------------------------------------------------------------
   Graph algorithm implementations
   ----------------------------------------------------------------------- */

function bfs(state, adjacency, start, snapshot) {
  const queue = [start];
  setNodeStatus(state, start, 'queued');
  state.currentNode = null;
  snapshot(`Enqueued start node ${start}`, [start]);

  while (queue.length > 0) {
    const current = queue.shift();
    setNodeStatus(state, current, 'visiting');
    state.currentNode = current;
    snapshot(`Visiting node ${current}`, [current]);

    const neighbors = (adjacency.get(current) || []).sort((a, b) => a - b);
    for (const neighbor of neighbors) {
      const neighborNode = state.nodes.find(n => n.id === neighbor);
      if (neighborNode && neighborNode.status === 'unvisited') {
        setNodeStatus(state, neighbor, 'queued');
        setEdgeStatus(state, current, neighbor, 'active');
        queue.push(neighbor);
        snapshot(`Enqueued neighbor ${neighbor} from node ${current}`, [current, neighbor]);
      }
    }

    setNodeStatus(state, current, 'visited');
    // Mark edges from current as visited
    for (const neighbor of neighbors) {
      const neighborNode = state.nodes.find(n => n.id === neighbor);
      if (neighborNode && neighborNode.status !== 'unvisited') {
        setEdgeStatus(state, current, neighbor, 'visited');
      }
    }
    state.currentNode = null;
    snapshot(`Finished visiting node ${current}`, [current]);
  }
}

function dfs(state, adjacency, start, snapshot) {
  const visited = new Set();

  function dfsRecursive(node) {
    visited.add(node);
    setNodeStatus(state, node, 'visiting');
    state.currentNode = node;
    snapshot(`Visiting node ${node}`, [node]);

    const neighbors = (adjacency.get(node) || []).sort((a, b) => a - b);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        setEdgeStatus(state, node, neighbor, 'active');
        snapshot(`Exploring edge ${node} → ${neighbor}`, [node, neighbor]);
        dfsRecursive(neighbor);
        // Backtrack
        state.currentNode = node;
        snapshot(`Backtracked to node ${node}`, [node]);
      }
    }

    setNodeStatus(state, node, 'visited');
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) {
        setEdgeStatus(state, node, neighbor, 'visited');
      }
    }
    snapshot(`Finished node ${node}`, [node]);
  }

  dfsRecursive(start);
}

function dijkstra(state, adjacency, start, snapshot) {
  const nodes = state.nodes.map(n => n.id);
  const dist = new Map();
  const visited = new Set();

  for (const id of nodes) {
    dist.set(id, id === start ? 0 : Infinity);
  }

  setNodeStatus(state, start, 'queued');
  snapshot(`Start node ${start} with distance 0`, [start]);

  for (let i = 0; i < nodes.length; i++) {
    // Find unvisited node with minimum distance
    let minDist = Infinity;
    let current = null;
    for (const id of nodes) {
      if (!visited.has(id) && dist.get(id) < minDist) {
        minDist = dist.get(id);
        current = id;
      }
    }

    if (current === null) break;

    visited.add(current);
    setNodeStatus(state, current, 'visiting');
    state.currentNode = current;
    snapshot(`Visiting node ${current} (distance: ${dist.get(current)})`, [current]);

    const neighbors = (adjacency.get(current) || []).sort((a, b) => a - b);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        // All edges have weight 1 for unweighted graphs
        const newDist = dist.get(current) + 1;
        if (newDist < dist.get(neighbor)) {
          dist.set(neighbor, newDist);
          setNodeStatus(state, neighbor, 'queued');
          setEdgeStatus(state, current, neighbor, 'active');
          snapshot(`Updated distance of node ${neighbor} to ${newDist}`, [current, neighbor]);
        }
      }
    }

    setNodeStatus(state, current, 'visited');
    for (const neighbor of neighbors) {
      setEdgeStatus(state, current, neighbor, 'visited');
    }
    state.currentNode = null;
    snapshot(`Finished node ${current}`, [current]);
  }
}

function bellmanFord(state, adjacency, edgeList, start, snapshot) {
  const nodes = state.nodes.map(n => n.id);
  const dist = new Map();
  for (const id of nodes) {
    dist.set(id, id === start ? 0 : Infinity);
  }

  setNodeStatus(state, start, 'queued');
  snapshot(`Start node ${start} with distance 0`, [start]);

  const V = nodes.length;
  for (let i = 0; i < V - 1; i++) {
    snapshot(`Relaxation pass ${i + 1} of ${V - 1}`, []);
    for (const edge of edgeList) {
      // Undirected: relax both directions
      for (const [u, v] of [[edge.from, edge.to], [edge.to, edge.from]]) {
        if (dist.get(u) !== Infinity && dist.get(u) + 1 < dist.get(v)) {
          dist.set(v, dist.get(u) + 1);
          setNodeStatus(state, v, 'queued');
          setEdgeStatus(state, u, v, 'active');
          snapshot(`Relaxed edge ${u} → ${v}, distance now ${dist.get(v)}`, [u, v]);
        }
      }
    }
  }

  // Mark all reachable nodes as visited
  for (const id of nodes) {
    if (dist.get(id) !== Infinity) {
      setNodeStatus(state, id, 'visited');
    }
  }
  for (const edge of edgeList) {
    setEdgeStatus(state, edge.from, edge.to, 'visited');
  }
  snapshot('Bellman-Ford complete', []);
}

function floydWarshall(state, adjacency, nodeSet, edgeList, snapshot) {
  const nodes = [...nodeSet].sort((a, b) => a - b);
  const n = nodes.length;
  const idx = new Map();
  nodes.forEach((id, i) => idx.set(id, i));

  // Initialize distance matrix
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const edge of edgeList) {
    const i = idx.get(edge.from);
    const j = idx.get(edge.to);
    dist[i][j] = 1;
    dist[j][i] = 1;
  }

  snapshot('Initialized distance matrix', []);

  for (let k = 0; k < n; k++) {
    setNodeStatus(state, nodes[k], 'visiting');
    state.currentNode = nodes[k];
    snapshot(`Using node ${nodes[k]} as intermediate`, [nodes[k]]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          snapshot(`Shorter path found: ${nodes[i]} → ${nodes[j]} via ${nodes[k]} (dist: ${dist[i][j]})`, [nodes[i], nodes[j]]);
        }
      }
    }

    setNodeStatus(state, nodes[k], 'visited');
    state.currentNode = null;
  }

  for (const edge of edgeList) {
    setEdgeStatus(state, edge.from, edge.to, 'visited');
  }
}

function kruskal(state, nodeSet, edgeList, snapshot) {
  const nodes = [...nodeSet].sort((a, b) => a - b);
  // Union-Find
  const parent = new Map();
  const rank = new Map();
  for (const id of nodes) {
    parent.set(id, id);
    rank.set(id, 0);
  }

  function find(x) {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  }

  function union(x, y) {
    const px = find(x);
    const py = find(y);
    if (px === py) return false;
    if (rank.get(px) < rank.get(py)) { parent.set(px, py); }
    else if (rank.get(px) > rank.get(py)) { parent.set(py, px); }
    else { parent.set(py, px); rank.set(px, rank.get(px) + 1); }
    return true;
  }

  // Sort edges by weight (all weight 1 for unweighted, so just use order)
  const sortedEdges = [...edgeList];
  snapshot('Sorted edges by weight', []);

  for (const edge of sortedEdges) {
    setEdgeStatus(state, edge.from, edge.to, 'active');
    snapshot(`Considering edge ${edge.from} - ${edge.to}`, [edge.from, edge.to]);

    if (union(edge.from, edge.to)) {
      setEdgeStatus(state, edge.from, edge.to, 'visited');
      setNodeStatus(state, edge.from, 'visited');
      setNodeStatus(state, edge.to, 'visited');
      snapshot(`Added edge ${edge.from} - ${edge.to} to MST`, [edge.from, edge.to]);
    } else {
      setEdgeStatus(state, edge.from, edge.to, 'normal');
      snapshot(`Skipped edge ${edge.from} - ${edge.to} (would form cycle)`, [edge.from, edge.to]);
    }
  }
}

function prim(state, adjacency, nodeSet, edgeList, start, snapshot) {
  const inMST = new Set();
  inMST.add(start);
  setNodeStatus(state, start, 'visited');
  snapshot(`Start MST from node ${start}`, [start]);

  while (inMST.size < nodeSet.size) {
    let bestEdge = null;
    // Find minimum weight edge crossing the cut (all weight 1)
    for (const edge of edgeList) {
      const aIn = inMST.has(edge.from);
      const bIn = inMST.has(edge.to);
      if ((aIn && !bIn) || (!aIn && bIn)) {
        if (!bestEdge) bestEdge = edge;
      }
    }

    if (!bestEdge) break;

    const newNode = inMST.has(bestEdge.from) ? bestEdge.to : bestEdge.from;
    setEdgeStatus(state, bestEdge.from, bestEdge.to, 'active');
    setNodeStatus(state, newNode, 'queued');
    snapshot(`Considering edge ${bestEdge.from} - ${bestEdge.to}`, [bestEdge.from, bestEdge.to]);

    inMST.add(newNode);
    setNodeStatus(state, newNode, 'visited');
    setEdgeStatus(state, bestEdge.from, bestEdge.to, 'visited');
    snapshot(`Added node ${newNode} to MST via edge ${bestEdge.from} - ${bestEdge.to}`, [newNode]);
  }
}

/* -----------------------------------------------------------------------
   Render function — draws SVG node-edge diagram with status coloring
   ----------------------------------------------------------------------- */

/**
 * Renders a single visualization step as an SVG node-edge diagram.
 * @param {HTMLElement} container
 * @param {VisualizationStep} step
 */
export function render(container, step) {
  const { nodes = [], edges = [], currentNode = null } = step.state;

  container.innerHTML = '';

  if (nodes.length === 0) {
    container.textContent = 'No graph data to visualize.';
    return;
  }

  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const nodeRadius = 20;

  // Compute circular layout positions
  const positions = new Map();
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions.set(node.id, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', step.description);
  svg.style.maxWidth = `${width}px`;
  svg.style.maxHeight = `${height}px`;

  // Draw edges first (behind nodes)
  for (const edge of edges) {
    const fromPos = positions.get(edge.from);
    const toPos = positions.get(edge.to);
    if (!fromPos || !toPos) continue;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromPos.x);
    line.setAttribute('y1', fromPos.y);
    line.setAttribute('x2', toPos.x);
    line.setAttribute('y2', toPos.y);

    let edgeClass = 'viz-edge';
    if (edge.status === 'active') edgeClass += ' viz-edge-active';
    else if (edge.status === 'visited') edgeClass += ' viz-edge-visited';
    line.setAttribute('class', edgeClass);

    line.setAttribute('stroke', edge.status === 'active' ? '#e74c3c' : edge.status === 'visited' ? '#27ae60' : '#999');
    line.setAttribute('stroke-width', edge.status === 'active' ? '3' : '2');

    svg.appendChild(line);
  }

  // Draw nodes
  for (const node of nodes) {
    const pos = positions.get(node.id);
    if (!pos) continue;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', nodeRadius);

    let nodeClass = 'viz-node';
    nodeClass += ` viz-node-${node.status}`;
    circle.setAttribute('class', nodeClass);

    // Color based on status
    const fillColors = {
      unvisited: '#ecf0f1',
      queued: '#f39c12',
      visiting: '#e74c3c',
      visited: '#27ae60',
    };
    circle.setAttribute('fill', fillColors[node.status] || '#ecf0f1');
    circle.setAttribute('stroke', node.id === currentNode ? '#2c3e50' : '#7f8c8d');
    circle.setAttribute('stroke-width', node.id === currentNode ? '3' : '1.5');

    g.appendChild(circle);

    // Node label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', node.status === 'unvisited' ? '#2c3e50' : '#fff');
    text.textContent = node.id;

    g.appendChild(text);
    g.setAttribute('aria-label', `Node ${node.id}: ${node.status}`);

    svg.appendChild(g);
  }

  container.appendChild(svg);
}
