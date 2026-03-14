/**
 * Code Viewer — displays syntax-highlighted source code with language
 * toggle, line numbers, copy-to-clipboard, loading indicator, and
 * error/retry handling.
 *
 * Uses Highlight.js (loaded via CDN in index.html) for syntax highlighting.
 * Fetches source files on demand from Java/ and Python/ directories.
 * ARIA labels on toggle and copy buttons for accessibility.
 */

/**
 * Renders the code viewer into the given container.
 * @param {HTMLElement} container
 * @param {{ java?: string|null, python?: string|null }} paths
 */
export async function renderCodeViewer(container, paths) {
  container.innerHTML = '';

  const languages = [];
  if (paths.java) languages.push({ key: 'java', label: 'Java', path: paths.java });
  if (paths.python) languages.push({ key: 'python', label: 'Python', path: paths.python });

  if (languages.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'no-results';
    msg.textContent = 'No source code available.';
    container.appendChild(msg);
    return;
  }

  const viewer = document.createElement('div');
  viewer.className = 'code-viewer';
  container.appendChild(viewer);

  // --- Toolbar: language toggle + copy button ---
  const toolbar = document.createElement('div');
  toolbar.className = 'code-toolbar';
  viewer.appendChild(toolbar);

  let activeLanguage = languages[0].key;
  const toggleButtons = [];

  // Language toggle buttons (only if both languages available)
  if (languages.length > 1) {
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'code-lang-toggle';
    toggleGroup.setAttribute('role', 'group');
    toggleGroup.setAttribute('aria-label', 'Select programming language');

    languages.forEach((lang) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn code-lang-btn';
      btn.textContent = lang.label;
      btn.setAttribute('aria-label', `Show ${lang.label} source code`);
      btn.setAttribute('aria-pressed', lang.key === activeLanguage ? 'true' : 'false');

      if (lang.key === activeLanguage) btn.classList.add('active');

      btn.addEventListener('click', () => {
        activeLanguage = lang.key;
        toggleButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        loadAndRender(lang);
      });

      toggleButtons.push(btn);
      toggleGroup.appendChild(btn);
    });

    toolbar.appendChild(toggleGroup);
  }

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn code-copy-btn';
  copyBtn.textContent = 'Copy';
  copyBtn.setAttribute('aria-label', 'Copy source code to clipboard');
  toolbar.appendChild(copyBtn);

  // --- Code display area ---
  const codeArea = document.createElement('div');
  codeArea.className = 'code-display';
  viewer.appendChild(codeArea);

  // Track current source for copy
  let currentSource = '';

  copyBtn.addEventListener('click', async () => {
    if (!currentSource) return;
    try {
      await navigator.clipboard.writeText(currentSource);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    } catch {
      copyBtn.textContent = 'Failed';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    }
  });

  /**
   * Fetches and renders source code for a given language.
   * @param {{ key: string, label: string, path: string }} lang
   */
  async function loadAndRender(lang) {
    // Show loading
    codeArea.innerHTML = '';
    const loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.textContent = 'Loading source code…';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-label', 'Loading source code');
    codeArea.appendChild(loading);

    try {
      const response = await fetch(lang.path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      currentSource = source;
      renderSource(codeArea, source, lang.key);
    } catch {
      currentSource = '';
      codeArea.innerHTML = '';

      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';

      const errorMsg = document.createElement('p');
      errorMsg.textContent = 'Could not load source file. Please try again.';
      errorDiv.appendChild(errorMsg);

      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn btn-primary';
      retryBtn.textContent = 'Retry';
      retryBtn.setAttribute('aria-label', 'Retry loading source code');
      retryBtn.addEventListener('click', () => loadAndRender(lang));
      errorDiv.appendChild(retryBtn);

      codeArea.appendChild(errorDiv);
    }
  }

  // Load the first language
  await loadAndRender(languages[0]);
}

/**
 * Renders syntax-highlighted source code with line numbers.
 * @param {HTMLElement} codeArea
 * @param {string} source
 * @param {string} langKey - 'java' or 'python'
 */
function renderSource(codeArea, source, langKey) {
  codeArea.innerHTML = '';

  const lines = source.split('\n');
  // Remove trailing empty line from split
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

  const table = document.createElement('table');
  table.className = 'code-table';
  table.setAttribute('role', 'presentation');

  const tbody = document.createElement('tbody');

  lines.forEach((line, i) => {
    const tr = document.createElement('tr');

    const lineNumTd = document.createElement('td');
    lineNumTd.className = 'code-line-numbers';
    lineNumTd.textContent = String(i + 1);
    lineNumTd.setAttribute('aria-hidden', 'true');
    tr.appendChild(lineNumTd);

    const codeTd = document.createElement('td');
    codeTd.className = 'code-line';
    const codeEl = document.createElement('code');
    codeEl.textContent = line;
    codeTd.appendChild(codeEl);
    tr.appendChild(codeTd);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  const pre = document.createElement('pre');
  pre.setAttribute('aria-label', `${langKey === 'java' ? 'Java' : 'Python'} source code`);
  pre.appendChild(table);
  codeArea.appendChild(pre);

  // Apply Highlight.js if available
  if (typeof hljs !== 'undefined') {
    const codeElements = codeArea.querySelectorAll('code');
    codeElements.forEach((el) => {
      el.classList.add(`language-${langKey}`);
      hljs.highlightElement(el);
    });
  }
}
