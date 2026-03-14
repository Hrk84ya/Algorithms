/**
 * Dynamic programming visualization renderer.
 * Exports computeSteps(data) and render(container, step) per the renderer interface.
 *
 * Supports: coin-change, knapsack-problem, longest-common-subsequence, edit-distance
 */

/**
 * @typedef {Object} VisualizationStep
 * @property {number} stepIndex
 * @property {string} description
 * @property {Object} state
 * @property {number[]} highlighted
 */

/**
 * Generates step-by-step visualization states for DP algorithms.
 * @param {{ algorithm: string, [key: string]: any }} data
 * @returns {VisualizationStep[]}
 */
export function computeSteps(data) {
  const { algorithm } = data;

  switch (algorithm) {
    case 'coin-change':
      return coinChangeSteps(data);
    case 'knapsack-problem':
      return knapsackSteps(data);
    case 'longest-common-subsequence':
      return lcsSteps(data);
    case 'edit-distance':
      return editDistanceSteps(data);
    default:
      return coinChangeSteps(data);
  }
}

/* -----------------------------------------------------------------------
   Coin Change
   ----------------------------------------------------------------------- */

function coinChangeSteps(data) {
  const { coins = [], amount = 0 } = data;
  const steps = [];
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;

  function snapshot(description, currentCell, action, compareCells = []) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: {
        table: [...dp],
        currentCell,
        compareCells,
        action,
        labels: { cols: Array.from({ length: amount + 1 }, (_, i) => String(i)) },
        dimensions: '1d',
      },
      highlighted: currentCell != null ? [currentCell] : [],
    });
  }

  snapshot('Initialize DP table: dp[0] = 0, rest = ∞', null, 'none');

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      const prev = i - coin;
      snapshot(`Coin ${coin}: comparing dp[${i}] = ${dp[i] === INF ? '∞' : dp[i]} with dp[${prev}] + 1 = ${dp[prev] === INF ? '∞' : dp[prev] + 1}`, i, 'compare', [prev]);

      if (dp[prev] + 1 < dp[i]) {
        dp[i] = dp[prev] + 1;
        snapshot(`Updated dp[${i}] = ${dp[i]}`, i, 'fill');
      }
    }
  }

  const result = dp[amount] >= INF ? -1 : dp[amount];
  snapshot(`Done! Minimum coins for amount ${amount}: ${result === -1 ? 'impossible' : result}`, null, 'done');

  return steps;
}

/* -----------------------------------------------------------------------
   Knapsack Problem (0/1)
   ----------------------------------------------------------------------- */

function knapsackSteps(data) {
  const { weights = [], values = [], capacity = 0 } = data;
  const n = weights.length;
  const steps = [];

  // dp[i][w] = max value using items 0..i-1 with capacity w
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  function snapshot(description, currentCell, action, compareCells = []) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: {
        table: dp.map(row => [...row]),
        currentCell,
        compareCells,
        action,
        labels: {
          rows: ['0', ...weights.map((w, i) => `Item ${i + 1} (w=${w}, v=${values[i]})`)],
          cols: Array.from({ length: capacity + 1 }, (_, i) => String(i)),
        },
        dimensions: '2d',
      },
      highlighted: currentCell ? [currentCell.row * (capacity + 1) + currentCell.col] : [],
    });
  }

  snapshot('Initialize DP table with zeros', null, 'none');

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      const cell = { row: i, col: w };
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
        snapshot(`Item ${i} (weight ${weights[i - 1]}) too heavy for capacity ${w}, skip`, cell, 'fill', [{ row: i - 1, col: w }]);
      } else {
        const without = dp[i - 1][w];
        const withItem = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        snapshot(`Item ${i}: compare skip (${without}) vs take (${withItem})`, cell, 'compare', [{ row: i - 1, col: w }, { row: i - 1, col: w - weights[i - 1] }]);
        dp[i][w] = Math.max(without, withItem);
        snapshot(`Set dp[${i}][${w}] = ${dp[i][w]}`, cell, 'fill');
      }
    }
  }

  snapshot(`Done! Maximum value: ${dp[n][capacity]}`, null, 'done');
  return steps;
}

/* -----------------------------------------------------------------------
   Longest Common Subsequence
   ----------------------------------------------------------------------- */

function lcsSteps(data) {
  const { str1 = '', str2 = '' } = data;
  const m = str1.length;
  const n = str2.length;
  const steps = [];

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  function snapshot(description, currentCell, action, compareCells = []) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: {
        table: dp.map(row => [...row]),
        currentCell,
        compareCells,
        action,
        labels: {
          rows: ['', ...str1.split('')],
          cols: ['', ...str2.split('')],
        },
        dimensions: '2d',
      },
      highlighted: currentCell ? [currentCell.row * (n + 1) + currentCell.col] : [],
    });
  }

  snapshot('Initialize LCS table with zeros', null, 'none');

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cell = { row: i, col: j };
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        snapshot(`'${str1[i - 1]}' == '${str2[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`, cell, 'fill', [{ row: i - 1, col: j - 1 }]);
      } else {
        const top = dp[i - 1][j];
        const left = dp[i][j - 1];
        snapshot(`'${str1[i - 1]}' != '${str2[j - 1]}': compare dp[${i - 1}][${j}]=${top} vs dp[${i}][${j - 1}]=${left}`, cell, 'compare', [{ row: i - 1, col: j }, { row: i, col: j - 1 }]);
        dp[i][j] = Math.max(top, left);
        snapshot(`Set dp[${i}][${j}] = ${dp[i][j]}`, cell, 'fill');
      }
    }
  }

  snapshot(`Done! LCS length: ${dp[m][n]}`, null, 'done');
  return steps;
}

/* -----------------------------------------------------------------------
   Edit Distance (Levenshtein)
   ----------------------------------------------------------------------- */

function editDistanceSteps(data) {
  const { str1 = '', str2 = '' } = data;
  const m = str1.length;
  const n = str2.length;
  const steps = [];

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  function snapshot(description, currentCell, action, compareCells = []) {
    steps.push({
      stepIndex: steps.length,
      description,
      state: {
        table: dp.map(row => [...row]),
        currentCell,
        compareCells,
        action,
        labels: {
          rows: ['', ...str1.split('')],
          cols: ['', ...str2.split('')],
        },
        dimensions: '2d',
      },
      highlighted: currentCell ? [currentCell.row * (n + 1) + currentCell.col] : [],
    });
  }

  snapshot('Initialize edit distance table with base cases', null, 'none');

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cell = { row: i, col: j };
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        snapshot(`'${str1[i - 1]}' == '${str2[j - 1]}': no edit needed, dp[${i}][${j}] = ${dp[i][j]}`, cell, 'fill', [{ row: i - 1, col: j - 1 }]);
      } else {
        const replace = dp[i - 1][j - 1];
        const remove = dp[i - 1][j];
        const insert = dp[i][j - 1];
        snapshot(`'${str1[i - 1]}' != '${str2[j - 1]}': compare replace(${replace}), delete(${remove}), insert(${insert})`, cell, 'compare', [{ row: i - 1, col: j - 1 }, { row: i - 1, col: j }, { row: i, col: j - 1 }]);
        dp[i][j] = 1 + Math.min(replace, remove, insert);
        snapshot(`Set dp[${i}][${j}] = ${dp[i][j]}`, cell, 'fill');
      }
    }
  }

  snapshot(`Done! Edit distance: ${dp[m][n]}`, null, 'done');
  return steps;
}

/* -----------------------------------------------------------------------
   Render function — draws table/grid with cell highlighting
   ----------------------------------------------------------------------- */

/**
 * Renders a single visualization step as a DP table/grid.
 * @param {HTMLElement} container
 * @param {VisualizationStep} step
 */
export function render(container, step) {
  const { table, currentCell, compareCells = [], action = 'none', labels, dimensions } = step.state;

  container.innerHTML = '';

  if (!table || (Array.isArray(table) && table.length === 0)) {
    container.textContent = 'No data to visualize.';
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'viz-dp-table';
  wrapper.style.overflowX = 'auto';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', step.description);

  const tbl = document.createElement('table');
  tbl.style.borderCollapse = 'collapse';
  tbl.style.fontSize = '0.85rem';

  if (dimensions === '1d') {
    render1D(tbl, table, currentCell, compareCells, action, labels);
  } else {
    render2D(tbl, table, currentCell, compareCells, action, labels);
  }

  wrapper.appendChild(tbl);
  container.appendChild(wrapper);
}

function render1D(tbl, table, currentIndex, compareCells, action, labels) {
  // Header row with column labels
  if (labels && labels.cols) {
    const headerRow = document.createElement('tr');
    for (const lbl of labels.cols) {
      const th = document.createElement('th');
      th.textContent = lbl;
      th.style.padding = '4px 8px';
      th.style.textAlign = 'center';
      headerRow.appendChild(th);
    }
    tbl.appendChild(headerRow);
  }

  // Value row
  const valueRow = document.createElement('tr');
  const compareSet = new Set(Array.isArray(compareCells) ? compareCells : []);

  for (let i = 0; i < table.length; i++) {
    const td = document.createElement('td');
    td.className = 'viz-dp-cell';
    td.textContent = table[i] >= table.length ? '∞' : String(table[i]);
    td.style.padding = '4px 8px';
    td.style.textAlign = 'center';
    td.style.border = '1px solid var(--border-color, #ccc)';
    td.setAttribute('aria-label', `Cell ${i}: ${td.textContent}`);

    if (i === currentIndex && (action === 'fill' || action === 'compare')) {
      td.classList.add('viz-dp-cell-active');
    } else if (compareSet.has(i) && action === 'compare') {
      td.classList.add('viz-dp-cell-compare');
    } else if (table[i] < table.length && table[i] > 0) {
      td.classList.add('viz-dp-cell-filled');
    }

    valueRow.appendChild(td);
  }
  tbl.appendChild(valueRow);
}

function render2D(tbl, table, currentCell, compareCells, action, labels) {
  const compareSet = new Set(
    (compareCells || []).map(c => `${c.row},${c.col}`)
  );

  // Header row
  if (labels && labels.cols) {
    const headerRow = document.createElement('tr');
    // Corner cell
    const corner = document.createElement('th');
    corner.style.padding = '4px 8px';
    headerRow.appendChild(corner);
    for (const lbl of labels.cols) {
      const th = document.createElement('th');
      th.textContent = lbl;
      th.style.padding = '4px 8px';
      th.style.textAlign = 'center';
      headerRow.appendChild(th);
    }
    tbl.appendChild(headerRow);
  }

  for (let i = 0; i < table.length; i++) {
    const tr = document.createElement('tr');

    // Row label
    if (labels && labels.rows) {
      const th = document.createElement('th');
      th.textContent = labels.rows[i] || '';
      th.style.padding = '4px 8px';
      th.style.textAlign = 'right';
      tr.appendChild(th);
    }

    for (let j = 0; j < table[i].length; j++) {
      const td = document.createElement('td');
      td.className = 'viz-dp-cell';
      td.textContent = String(table[i][j]);
      td.style.padding = '4px 8px';
      td.style.textAlign = 'center';
      td.style.border = '1px solid var(--border-color, #ccc)';
      td.setAttribute('aria-label', `Cell [${i}][${j}]: ${table[i][j]}`);

      const isCurrentCell = currentCell && currentCell.row === i && currentCell.col === j;
      const isCompareCell = compareSet.has(`${i},${j}`);

      if (isCurrentCell && (action === 'fill' || action === 'compare')) {
        td.classList.add('viz-dp-cell-active');
      } else if (isCompareCell && action === 'compare') {
        td.classList.add('viz-dp-cell-compare');
      } else if (table[i][j] > 0) {
        td.classList.add('viz-dp-cell-filled');
      }

      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
}
