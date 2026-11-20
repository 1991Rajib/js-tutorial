import { ADVANCED_TOPICS } from './data/topics.js';
import { INTERVIEW_QUESTIONS } from './data/interview.js';
import { JS_METHODS } from './data/methods.js';

// ============================================================================
// State Management & Persistence
// ============================================================================
const STORAGE_KEYS = {
  MASTERED: 'js_prep_mastered_ids_v1',
  BOOKMARKED: 'js_prep_bookmarked_ids_v1',
  THEME: 'js_prep_theme_v1'
};

const state = {
  activeTab: 'advanced-topics', // 'advanced-topics' | 'methods-encyclopedia' | 'interview-vault' | 'quick-cheatsheet'
  searchQuery: '',
  selectedCategory: 'all',
  selectedMethodCategory: 'all',
  selectedInterviewType: 'all',
  selectedCompany: 'all',
  selectedDifficulty: 'all',
  showBookmarkedOnly: false,
  showUncompletedOnly: false,
  openCards: new Set(),
  activeExampleTab: {}, // { [cardId]: 'simple' | 'real' }
  masteredIds: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.MASTERED) || '[]')),
  bookmarkedIds: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKED) || '[]'))
};

// ============================================================================
// DOM References
// ============================================================================
const dom = {
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  tabButtons: document.querySelectorAll('.tab-btn'),
  topicsCountBadge: document.getElementById('topicsCountBadge'),
  methodsCountBadge: document.getElementById('methodsCountBadge'),
  interviewCountBadge: document.getElementById('interviewCountBadge'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  resultsCount: document.getElementById('resultsCount'),
  activeFilterTags: document.getElementById('activeFilterTags'),
  cardsContainer: document.getElementById('cardsContainer'),
  methodsView: document.getElementById('methodsView'),
  cheatsheetView: document.getElementById('cheatsheetView'),
  // Filters
  categoryFilterGroup: document.getElementById('categoryFilterGroup'),
  categoryPills: document.getElementById('categoryPills'),
  methodTypeFilterGroup: document.getElementById('methodTypeFilterGroup'),
  methodTypePills: document.getElementById('methodTypePills'),
  interviewTypeFilterGroup: document.getElementById('interviewTypeFilterGroup'),
  interviewTypePills: document.getElementById('interviewTypePills'),
  companyFilterGroup: document.getElementById('companyFilterGroup'),
  companyPills: document.getElementById('companyPills'),
  difficultyFilterGroup: document.getElementById('difficultyFilterGroup'),
  difficultyPills: document.getElementById('difficultyPills'),
  showBookmarkedOnly: document.getElementById('showBookmarkedOnly'),
  showUncompletedOnly: document.getElementById('showUncompletedOnly'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  expandAllBtn: document.getElementById('expandAllBtn'),
  collapseAllBtn: document.getElementById('collapseAllBtn'),
  // Playground Drawer
  playgroundDrawer: document.getElementById('playgroundDrawer'),
  playgroundDrawerBtn: document.getElementById('playgroundDrawerBtn'),
  closeDrawerBtn: document.getElementById('closeDrawerBtn'),
  codeEditor: document.getElementById('codeEditor'),
  runCodeBtn: document.getElementById('runCodeBtn'),
  clearConsoleBtn: document.getElementById('clearConsoleBtn'),
  consoleOutput: document.getElementById('consoleOutput'),
  toastContainer: document.getElementById('toastContainer')
};

// ============================================================================
// Initialization
// ============================================================================
function init() {
  initTheme();
  initCategoryPills();
  updateHeaderCounts();
  updateProgressBar();
  bindEvents();
  render();
}

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = dom.themeToggleBtn.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function initCategoryPills() {
  const categories = ['all', ...new Set(ADVANCED_TOPICS.map(t => t.category))];
  dom.categoryPills.innerHTML = categories.map(cat => `
    <button class="pill ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
      ${cat === 'all' ? 'All Categories' : cat}
    </button>
  `).join('');
}

function updateHeaderCounts() {
  dom.topicsCountBadge.textContent = ADVANCED_TOPICS.length;
  dom.methodsCountBadge.textContent = JS_METHODS.length;
  dom.interviewCountBadge.textContent = INTERVIEW_QUESTIONS.length;
}

function updateProgressBar() {
  const totalItems = ADVANCED_TOPICS.length + INTERVIEW_QUESTIONS.length + JS_METHODS.length;
  const masteredCount = state.masteredIds.size;
  const percent = totalItems > 0 ? Math.round((masteredCount / totalItems) * 100) : 0;
  dom.progressBar.style.width = `${percent}%`;
  dom.progressText.textContent = `${percent}% (${masteredCount}/${totalItems})`;
}

// ============================================================================
// Event Binding
// ============================================================================
function bindEvents() {
  // Theme Toggle
  dom.themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // Tab Switching
  dom.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.activeTab = btn.dataset.tab;
      handleTabVisibility();
      render();
    });
  });

  // Search input with debounce
  let searchTimer;
  dom.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const val = e.target.value.trim();
    dom.clearSearchBtn.hidden = val.length === 0;
    searchTimer = setTimeout(() => {
      state.searchQuery = val.toLowerCase();
      render();
    }, 150);
  });

  dom.clearSearchBtn.addEventListener('click', () => {
    dom.searchInput.value = '';
    state.searchQuery = '';
    dom.clearSearchBtn.hidden = true;
    dom.searchInput.focus();
    render();
  });

  // Category Filter (Topics)
  dom.categoryPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    dom.categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedCategory = pill.dataset.category;
    render();
  });

  // Method Type Filter
  dom.methodTypePills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    dom.methodTypePills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedMethodCategory = pill.dataset.methodCat;
    render();
  });

  // Interview Type Filter
  dom.interviewTypePills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    dom.interviewTypePills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedInterviewType = pill.dataset.type;
    render();
  });

  // Company Filter
  dom.companyPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    dom.companyPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedCompany = pill.dataset.company;
    render();
  });

  // Difficulty Filter
  dom.difficultyPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    dom.difficultyPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedDifficulty = pill.dataset.difficulty;
    render();
  });

  // Checkbox status filters
  dom.showBookmarkedOnly.addEventListener('change', (e) => {
    state.showBookmarkedOnly = e.target.checked;
    render();
  });

  dom.showUncompletedOnly.addEventListener('change', (e) => {
    state.showUncompletedOnly = e.target.checked;
    render();
  });

  // Reset Filters
  dom.resetFiltersBtn.addEventListener('click', resetAllFilters);

  // Expand / Collapse All
  dom.expandAllBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.classList.add('open');
      state.openCards.add(card.dataset.id);
    });
  });

  dom.collapseAllBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.remove('open'));
    state.openCards.clear();
  });

  // Card Delegation (Expand/Collapse, Example Tab Switcher, Bookmark, Master, Copy, Run)
  dom.cardsContainer.addEventListener('click', handleCardInteraction);
  dom.methodsView.addEventListener('click', handleCardInteraction);

  // Playground Drawer Controls
  dom.playgroundDrawerBtn.addEventListener('click', togglePlaygroundDrawer);
  dom.closeDrawerBtn.addEventListener('click', () => dom.playgroundDrawer.classList.remove('open'));
  dom.runCodeBtn.addEventListener('click', executePlaygroundCode);
  dom.clearConsoleBtn.addEventListener('click', clearConsole);

  // Editor shortcut: Ctrl/Cmd + Enter
  dom.codeEditor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executePlaygroundCode();
    }
  });
}

function handleTabVisibility() {
  dom.categoryFilterGroup.hidden = state.activeTab !== 'advanced-topics';
  dom.methodTypeFilterGroup.hidden = state.activeTab !== 'methods-encyclopedia';
  dom.interviewTypeFilterGroup.hidden = state.activeTab !== 'interview-vault';
  dom.companyFilterGroup.hidden = state.activeTab !== 'interview-vault';
  dom.difficultyFilterGroup.hidden = state.activeTab === 'methods-encyclopedia' || state.activeTab === 'quick-cheatsheet';

  dom.cardsContainer.hidden = state.activeTab === 'methods-encyclopedia' || state.activeTab === 'quick-cheatsheet';
  dom.methodsView.hidden = state.activeTab !== 'methods-encyclopedia';
  dom.cheatsheetView.hidden = state.activeTab !== 'quick-cheatsheet';
}

function resetAllFilters() {
  state.searchQuery = '';
  state.selectedCategory = 'all';
  state.selectedMethodCategory = 'all';
  state.selectedInterviewType = 'all';
  state.selectedCompany = 'all';
  state.selectedDifficulty = 'all';
  state.showBookmarkedOnly = false;
  state.showUncompletedOnly = false;

  dom.searchInput.value = '';
  dom.clearSearchBtn.hidden = true;
  dom.showBookmarkedOnly.checked = false;
  dom.showUncompletedOnly.checked = false;

  document.querySelectorAll('.filter-pills .pill').forEach(pill => {
    if (pill.dataset.category === 'all' || pill.dataset.methodCat === 'all' || 
        pill.dataset.type === 'all' || pill.dataset.company === 'all' || pill.dataset.difficulty === 'all') {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  render();
  showToast('Filters reset to default', 'info');
}

// ============================================================================
// Card Interaction Handler
// ============================================================================
function handleCardInteraction(e) {
  // 1. Example Switcher Tabs (Simple Example vs Real-World Example)
  const switchBtn = e.target.closest('.switch-tab-btn');
  if (switchBtn) {
    e.stopPropagation();
    const card = switchBtn.closest('.card');
    const cardId = card.dataset.id;
    const tabType = switchBtn.dataset.exampleTab; // 'simple' | 'real'

    state.activeExampleTab[cardId] = tabType;

    // Update switcher tab active class
    card.querySelectorAll('.switch-tab-btn').forEach(b => b.classList.remove('active'));
    switchBtn.classList.add('active');

    // Toggle code views inside this card
    const simpleBox = card.querySelector('.simple-code-box');
    const realBox = card.querySelector('.real-code-box');
    if (simpleBox && realBox) {
      if (tabType === 'simple') {
        simpleBox.hidden = false;
        realBox.hidden = true;
      } else {
        simpleBox.hidden = true;
        realBox.hidden = false;
      }
    }
    return;
  }

  const card = e.target.closest('.card') || e.target.closest('.method-card');
  if (!card) return;
  const id = card.dataset.id;

  // 2. Bookmark Toggle
  const bookmarkBtn = e.target.closest('.bookmark-btn');
  if (bookmarkBtn) {
    e.stopPropagation();
    if (state.bookmarkedIds.has(id)) {
      state.bookmarkedIds.delete(id);
      bookmarkBtn.classList.remove('active');
      showToast('Removed from bookmarks');
    } else {
      state.bookmarkedIds.add(id);
      bookmarkBtn.classList.add('active');
      showToast('Saved to bookmarks ⭐', 'success');
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED, JSON.stringify([...state.bookmarkedIds]));
    return;
  }

  // 3. Mastered / Understood Toggle
  const masterBtn = e.target.closest('.master-btn');
  if (masterBtn) {
    e.stopPropagation();
    if (state.masteredIds.has(id)) {
      state.masteredIds.delete(id);
      masterBtn.classList.remove('active');
      card.classList.remove('mastered');
      showToast('Marked as needs revision');
    } else {
      state.masteredIds.add(id);
      masterBtn.classList.add('active');
      card.classList.add('mastered');
      showToast('Marked as Mastered! 🎉', 'success');
    }
    localStorage.setItem(STORAGE_KEYS.MASTERED, JSON.stringify([...state.masteredIds]));
    updateProgressBar();
    return;
  }

  // 4. Copy Code Button
  const copyBtn = e.target.closest('.copy-code-btn');
  if (copyBtn) {
    e.stopPropagation();
    const code = decodeURIComponent(copyBtn.dataset.code);
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✓ Copied!';
      setTimeout(() => { copyBtn.innerHTML = originalText; }, 1500);
      showToast('Code copied to clipboard', 'info');
    });
    return;
  }

  // 5. Try in Playground Button
  const tryBtn = e.target.closest('.try-playground-btn');
  if (tryBtn) {
    e.stopPropagation();
    const code = decodeURIComponent(tryBtn.dataset.code);
    dom.codeEditor.value = code;
    dom.playgroundDrawer.classList.add('open');
    dom.codeEditor.focus();
    executePlaygroundCode();
    showToast('Loaded into Live Playground', 'info');
    return;
  }

  // 6. Expand / Collapse Header Click
  const header = e.target.closest('.card-header');
  if (header) {
    card.classList.toggle('open');
    if (card.classList.contains('open')) {
      state.openCards.add(id);
    } else {
      state.openCards.delete(id);
    }
  }
}

// ============================================================================
// Filtering & Rendering
// ============================================================================
function getFilteredItems() {
  if (state.activeTab === 'methods-encyclopedia') {
    return JS_METHODS.filter(m => {
      if (state.searchQuery) {
        const q = state.searchQuery;
        const matchName = m.name.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchSyntax = m.syntax.toLowerCase().includes(q);
        const matchCode = m.simpleExample.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSyntax && !matchCode) return false;
      }
      if (state.selectedMethodCategory !== 'all' && m.category !== state.selectedMethodCategory) {
        return false;
      }
      return true;
    });
  }

  const isTopicsTab = state.activeTab === 'advanced-topics';
  const rawList = isTopicsTab ? ADVANCED_TOPICS : INTERVIEW_QUESTIONS;

  return rawList.filter(item => {
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = (item.summary || item.question || item.simpleExplanation || '').toLowerCase().includes(q);
      const matchSyntax = (item.syntax || '').toLowerCase().includes(q);
      const matchCode = (item.codeExample || item.simpleExample || item.runnableCode || '').toLowerCase().includes(q);
      const matchCompanies = (item.companies || []).some(c => c.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchSyntax && !matchCode && !matchCompanies) {
        return false;
      }
    }

    if (isTopicsTab && state.selectedCategory !== 'all') {
      if (item.category !== state.selectedCategory) return false;
    }

    if (!isTopicsTab && state.selectedInterviewType !== 'all') {
      if (item.type !== state.selectedInterviewType) return false;
    }

    if (!isTopicsTab && state.selectedCompany !== 'all') {
      if (!item.companies || !item.companies.includes(state.selectedCompany)) return false;
    }

    if (state.selectedDifficulty !== 'all') {
      if (item.difficulty !== state.selectedDifficulty) return false;
    }

    if (state.showBookmarkedOnly && !state.bookmarkedIds.has(item.id)) {
      return false;
    }

    if (state.showUncompletedOnly && state.masteredIds.has(item.id)) {
      return false;
    }

    return true;
  });
}

function render() {
  if (state.activeTab === 'quick-cheatsheet') {
    renderCheatsheet();
    return;
  }

  if (state.activeTab === 'methods-encyclopedia') {
    renderMethods();
    return;
  }

  const items = getFilteredItems();
  dom.resultsCount.textContent = items.length;

  if (items.length === 0) {
    dom.cardsContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 28px; margin-bottom: 8px;">🔍</p>
        <h3 style="font-size: 18px; margin-bottom: 6px;">No topics or questions match your criteria</h3>
        <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 18px;">Try adjusting your search terms or clearing active filters.</p>
        <button onclick="document.getElementById('resetFiltersBtn').click()" class="secondary-btn">Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (state.activeTab === 'advanced-topics') {
    dom.cardsContainer.innerHTML = items.map(renderTopicCard).join('');
  } else {
    dom.cardsContainer.innerHTML = items.map(renderInterviewCard).join('');
  }
}

function renderTopicCard(topic) {
  const isMastered = state.masteredIds.has(topic.id);
  const isBookmarked = state.bookmarkedIds.has(topic.id);
  const isOpen = state.openCards.has(topic.id);
  const diffClass = `badge-${topic.difficulty.toLowerCase().replace(/\s+/g, '-')}`;
  const currentExampleTab = state.activeExampleTab[topic.id] || 'simple';

  return `
    <article class="card ${isOpen ? 'open' : ''} ${isMastered ? 'mastered' : ''}" data-id="${topic.id}">
      <div class="card-header" role="button" tabindex="0" aria-expanded="${isOpen}">
        <div class="card-header-left">
          <div class="card-meta-row">
            <span class="meta-badge badge-category">${topic.category}</span>
            <span class="meta-badge ${diffClass}">${topic.difficulty}</span>
          </div>
          <h2 class="card-title">${topic.title}</h2>
          <p class="card-summary">${topic.summary}</p>
        </div>

        <div class="card-header-actions">
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" title="Bookmark this topic" aria-label="Bookmark">
            ⭐
          </button>
          <button class="master-btn ${isMastered ? 'active' : ''}" title="Mark as Mastered / Understood" aria-label="Mastered">
            ✓
          </button>
          <span class="expand-chevron">▼</span>
        </div>
      </div>

      <div class="card-body">
        <!-- PLAIN ENGLISH EXPLANATION -->
        ${topic.simpleExplanation ? `
          <div class="callout-plain-english">
            <strong>💡 Plain English Explanation:</strong>
            ${escapeHtml(topic.simpleExplanation)}
          </div>
        ` : ''}

        <!-- CONCEPT CLARIFIERS (What is TDZ, Hoisting, Call Stack) -->
        ${topic.conceptClarifiers && topic.conceptClarifiers.length > 0 ? `
          <div class="concept-clarifiers-box">
            <div style="font-size: 12.5px; font-weight: 800; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.05em; margin-bottom: 4px;">
              Key Terminology Explained in Simple Words
            </div>
            ${topic.conceptClarifiers.map(c => `
              <div class="concept-item">
                <div class="concept-term">🔍 ${escapeHtml(c.term)}</div>
                <div class="concept-meaning">${escapeHtml(c.meaning)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- SPEC GRID: SYNTAX & RETURN TYPES -->
        <div class="spec-grid">
          <div class="spec-item">
            <span class="spec-label">Formal Syntax</span>
            <div class="spec-value"><code>${escapeHtml(topic.syntax)}</code></div>
          </div>
          <div class="spec-item">
            <span class="spec-label">Exact Return Type</span>
            <div class="spec-value return-type">${escapeHtml(topic.returnType)}</div>
          </div>
          <div class="spec-item">
            <span class="spec-label">Mutates Target?</span>
            <div class="spec-value ${topic.mutates.toLowerCase().includes('no') ? 'pure' : topic.mutates.toLowerCase().includes('yes') ? 'mutates' : ''}">
              ${escapeHtml(topic.mutates)}
            </div>
          </div>
        </div>

        <!-- EXAMPLE SWITCHER: SIMPLE VS REAL-WORLD -->
        <div class="example-switcher">
          <div class="switcher-tabs">
            <button class="switch-tab-btn ${currentExampleTab === 'simple' ? 'active' : ''}" data-example-tab="simple">
              🟢 Simple Example (Beginner-Friendly)
            </button>
            <button class="switch-tab-btn ${currentExampleTab === 'real' ? 'active' : ''}" data-example-tab="real">
              🔵 Real-World Advanced Example
            </button>
          </div>

          <!-- SIMPLE CODE BOX -->
          <div class="code-box simple-code-box" ${currentExampleTab === 'simple' ? '' : 'hidden'}>
            <div class="code-box-header">
              <span class="code-lang-label">JavaScript (Simple Example)</span>
              <div class="code-box-actions">
                <button class="code-action-btn copy-code-btn" data-code="${encodeURIComponent(topic.simpleExample || topic.codeExample)}">
                  📋 Copy
                </button>
                <button class="code-action-btn try-playground-btn" data-code="${encodeURIComponent(topic.simpleExample || topic.codeExample)}">
                  ▶ Try in Playground
                </button>
              </div>
            </div>
            <pre><code>${escapeHtml(topic.simpleExample || topic.codeExample)}</code></pre>
          </div>

          <!-- REAL-WORLD ADVANCED CODE BOX -->
          <div class="code-box real-code-box" ${currentExampleTab === 'real' ? '' : 'hidden'}>
            <div class="code-box-header">
              <span class="code-lang-label">JavaScript (Real-World Production Example)</span>
              <div class="code-box-actions">
                <button class="code-action-btn copy-code-btn" data-code="${encodeURIComponent(topic.codeExample)}">
                  📋 Copy
                </button>
                <button class="code-action-btn try-playground-btn" data-code="${encodeURIComponent(topic.codeExample)}">
                  ▶ Try in Playground
                </button>
              </div>
            </div>
            <pre><code>${escapeHtml(topic.codeExample)}</code></pre>
          </div>
        </div>

        <!-- LINE-BY-LINE CODE WALKTHROUGH -->
        ${topic.walkthrough && topic.walkthrough.length > 0 ? `
          <div class="walkthrough-box">
            <span class="walkthrough-title">Step-by-Step Code Walkthrough</span>
            <ul class="walkthrough-list">
              ${topic.walkthrough.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- ENGINE UNDER THE HOOD INSIGHT -->
        ${topic.engineUnderTheHood ? `
          <div class="callout callout-engine">
            <span class="callout-icon">⚙️</span>
            <div class="callout-content">
              <strong>V8 Engine Under The Hood:</strong>
              ${escapeHtml(topic.engineUnderTheHood)}
            </div>
          </div>
        ` : ''}

        <!-- COMMON PITFALLS -->
        ${topic.commonPitfalls ? `
          <div class="callout callout-pitfall">
            <span class="callout-icon">⚠️</span>
            <div class="callout-content">
              <strong>Common Trap to Avoid in Interviews:</strong>
              ${escapeHtml(topic.commonPitfalls)}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

function renderInterviewCard(q) {
  const isMastered = state.masteredIds.has(q.id);
  const isBookmarked = state.bookmarkedIds.has(q.id);
  const isOpen = state.openCards.has(q.id);
  const diffClass = `badge-${q.difficulty.toLowerCase()}`;

  const typeLabels = {
    output: "Output Tricky",
    polyfill: "Polyfill Writing",
    concept: "Architecture & Theory",
    coding: "Machine Coding"
  };

  return `
    <article class="card ${isOpen ? 'open' : ''} ${isMastered ? 'mastered' : ''}" data-id="${q.id}">
      <div class="card-header" role="button" tabindex="0" aria-expanded="${isOpen}">
        <div class="card-header-left">
          <div class="card-meta-row">
            <span class="meta-badge badge-category">${typeLabels[q.type] || q.type}</span>
            <span class="meta-badge ${diffClass}">${q.difficulty}</span>
            ${(q.companies || []).map(comp => `<span class="company-tag">${comp}</span>`).join('')}
          </div>
          <h2 class="card-title">${q.title}</h2>
          <p class="card-summary">${escapeHtml(q.question)}</p>
        </div>

        <div class="card-header-actions">
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" title="Bookmark this question" aria-label="Bookmark">
            ⭐
          </button>
          <button class="master-btn ${isMastered ? 'active' : ''}" title="Mark as Mastered / Understood" aria-label="Mastered">
            ✓
          </button>
          <span class="expand-chevron">▼</span>
        </div>
      </div>

      <div class="card-body">
        <!-- QUESTION CODE SNIPPET (IF ANY) -->
        ${q.codeSnippet ? `
          <div class="code-box">
            <div class="code-box-header">
              <span class="code-lang-label">Interview Problem Code</span>
              <div class="code-box-actions">
                <button class="code-action-btn copy-code-btn" data-code="${encodeURIComponent(q.codeSnippet)}">
                  📋 Copy
                </button>
              </div>
            </div>
            <pre><code>${escapeHtml(q.codeSnippet)}</code></pre>
          </div>
        ` : ''}

        <!-- DETAILED ANSWER & EXPLANATION -->
        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--brand-blue); margin-bottom: 10px;">Step-by-Step Answer & Explanation</h4>
          <pre style="background: transparent; border: none; padding: 0; color: var(--text-main); font-family: var(--font-sans); white-space: pre-wrap; font-size: 15px; line-height: 1.65;">${escapeHtml(q.answer)}</pre>
        </div>

        <!-- RUNNABLE SOLUTION IN PLAYGROUND -->
        ${q.runnableCode ? `
          <div class="code-box">
            <div class="code-box-header">
              <span class="code-lang-label">Executable Verifiable Code</span>
              <div class="code-box-actions">
                <button class="code-action-btn copy-code-btn" data-code="${encodeURIComponent(q.runnableCode)}">
                  📋 Copy
                </button>
                <button class="code-action-btn try-playground-btn" data-code="${encodeURIComponent(q.runnableCode)}">
                  ▶ Run in Playground
                </button>
              </div>
            </div>
            <pre><code>${escapeHtml(q.runnableCode)}</code></pre>
          </div>
        ` : ''}

        <!-- INTERVIEWER SECRET TIP -->
        ${q.interviewerTip ? `
          <div class="callout callout-interview">
            <span class="callout-icon">💡</span>
            <div class="callout-content">
              <strong>MNC Interviewer Secret Talking Point:</strong>
              ${escapeHtml(q.interviewerTip)}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

function renderMethods() {
  const methods = getFilteredItems();
  dom.resultsCount.textContent = methods.length;

  dom.methodsView.innerHTML = `
    <div style="margin-bottom: 10px;">
      <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px;">JavaScript Methods Encyclopedia</h2>
      <p style="color: var(--text-muted); font-size: 15px;">
        Every standard method across Array, String, Object, Promise, and Map/Set with formal syntax, exact return type, mutability flag, and a simple runnable example.
      </p>
    </div>

    <div class="methods-grid">
      ${methods.map(m => `
        <div class="method-card" data-id="method-${m.name}">
          <div class="method-header">
            <span class="method-name">${escapeHtml(m.name)}</span>
            <span class="meta-badge badge-category">${m.category}</span>
          </div>

          <p class="method-description">${escapeHtml(m.description)}</p>

          <div class="spec-grid" style="padding: 12px; gap: 10px;">
            <div class="spec-item">
              <span class="spec-label">Syntax</span>
              <div class="spec-value"><code>${escapeHtml(m.syntax)}</code></div>
            </div>
            <div class="spec-item">
              <span class="spec-label">Parameters</span>
              <div class="spec-value" style="font-size: 13px; color: var(--text-muted);">${escapeHtml(m.parameters)}</div>
            </div>
            <div class="spec-item">
              <span class="spec-label">Return Type</span>
              <div class="spec-value return-type">${escapeHtml(m.returnType)}</div>
            </div>
            <div class="spec-item">
              <span class="spec-label">Mutates Original?</span>
              <div class="spec-value ${m.mutates.toLowerCase().includes('no') ? 'pure' : 'mutates'}">
                ${escapeHtml(m.mutates)}
              </div>
            </div>
          </div>

          <!-- SIMPLE RUNNABLE CODE -->
          <div class="code-box">
            <div class="code-box-header">
              <span class="code-lang-label">Simple Example</span>
              <div class="code-box-actions">
                <button class="code-action-btn copy-code-btn" data-code="${encodeURIComponent(m.simpleExample)}">
                  📋 Copy
                </button>
                <button class="code-action-btn try-playground-btn" data-code="${encodeURIComponent(m.simpleExample)}">
                  ▶ Try in Playground
                </button>
              </div>
            </div>
            <pre><code>${escapeHtml(m.simpleExample)}</code></pre>
          </div>

          ${m.interviewTip ? `
            <div class="callout callout-interview" style="padding: 10px 14px; font-size: 13.5px;">
              <span class="callout-icon">💡</span>
              <div class="callout-content">
                <strong>Interview Tip:</strong> ${escapeHtml(m.interviewTip)}
              </div>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderCheatsheet() {
  const cheatsheetData = [
    { method: "Array.prototype.map(callback)", returnType: "New Array (T[])", mutates: "No", params: "(element, index, array)", summary: "Transforms each item into a new element" },
    { method: "Array.prototype.filter(predicate)", returnType: "New Array (T[])", mutates: "No", params: "(element, index, array)", summary: "Keeps items where predicate returns truthy" },
    { method: "Array.prototype.reduce(reducer, init)", returnType: "Accumulator (any)", mutates: "No", params: "(acc, cur, idx, src)", summary: "Folds array into single accumulated value" },
    { method: "Array.prototype.flatMap(callback)", returnType: "New Array (T[])", mutates: "No", params: "(element, index, array)", summary: "Maps then flattens by depth of 1" },
    { method: "Array.prototype.sort(compareFn)", returnType: "Mutated Array", mutates: "YES (In-place)", params: "(a, b)", summary: "Sorts lexicographically if compareFn omitted!" },
    { method: "Array.prototype.toSorted(compareFn)", returnType: "New Array (ES2023)", mutates: "No (Pure)", params: "(a, b)", summary: "Modern non-mutating sort counterpart" },
    { method: "Array.prototype.toReversed()", returnType: "New Array (ES2023)", mutates: "No (Pure)", params: "None", summary: "Modern non-mutating reverse" },
    { method: "Array.prototype.toSpliced(start, count)", returnType: "New Array (ES2023)", mutates: "No (Pure)", params: "(start, deleteCount, ...items)", summary: "Non-mutating splice counterpart" },
    { method: "Array.prototype.with(index, value)", returnType: "New Array (ES2023)", mutates: "No (Pure)", params: "(index, value)", summary: "Returns copy with element at index replaced" },
    { method: "Function.prototype.call(thisArg, ...args)", returnType: "Result of invocation", mutates: "No", params: "(thisArg, arg1, arg2...)", summary: "Invokes immediately with given this" },
    { method: "Function.prototype.apply(thisArg, argsArray)", returnType: "Result of invocation", mutates: "No", params: "(thisArg, [args])", summary: "Invokes immediately with arguments array" },
    { method: "Function.prototype.bind(thisArg, ...preset)", returnType: "New Function", mutates: "No", params: "(thisArg, ...presetArgs)", summary: "Returns permanently-bound new function" },
    { method: "Promise.all(iterable)", returnType: "Promise<Array>", mutates: "No", params: "Iterable of promises", summary: "Fails fast on 1st reject; resolves all values" },
    { method: "Promise.allSettled(iterable)", returnType: "Promise<OutcomeObj[]>", mutates: "No", params: "Iterable of promises", summary: "Waits for all to settle; never rejects" },
    { method: "Promise.race(iterable)", returnType: "Promise<FirstSettled>", mutates: "No", params: "Iterable of promises", summary: "Resolves or rejects with 1st settled item" },
    { method: "Promise.any(iterable)", returnType: "Promise<FirstFulfilled>", mutates: "No", params: "Iterable of promises", summary: "Resolves with 1st successful; rejects if all fail" },
    { method: "structuredClone(value)", returnType: "Deep Clone (any)", mutates: "No", params: "(value, [options])", summary: "Native deep copy handling circular refs, Dates, Maps" }
  ];

  dom.cheatsheetView.innerHTML = `
    <div>
      <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px;">JavaScript Syntax & Return Types Quick Reference Matrix</h2>
      <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 20px;">
        High-yield reference table detailing parameter signatures, exact return types, and mutability status frequently grilled in MNC technical rounds.
      </p>
    </div>

    <div style="overflow-x: auto;">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Method / Expression</th>
            <th>Parameters</th>
            <th>Return Type</th>
            <th>Mutates Original?</th>
            <th>Summary & MNC Focus</th>
          </tr>
        </thead>
        <tbody>
          ${cheatsheetData.map(row => `
            <tr>
              <td><code style="font-weight: 700; font-size: 14px;">${escapeHtml(row.method)}</code></td>
              <td><span style="font-family: var(--font-mono); font-size: 13px; color: var(--text-muted);">${escapeHtml(row.params)}</span></td>
              <td><span style="color: var(--brand-purple); font-weight: 700; font-family: var(--font-mono); font-size: 13.5px;">${escapeHtml(row.returnType)}</span></td>
              <td>
                <span class="meta-badge ${row.mutates.startsWith('YES') ? 'badge-hard' : 'badge-easy'}">
                  ${escapeHtml(row.mutates)}
                </span>
              </td>
              <td style="color: var(--text-main); font-size: 14px;">${escapeHtml(row.summary)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================================
// Live Code Playground Sandbox & Console Interceptor
// ============================================================================
function togglePlaygroundDrawer() {
  dom.playgroundDrawer.classList.toggle('open');
  if (dom.playgroundDrawer.classList.contains('open')) {
    dom.codeEditor.focus();
  }
}

function clearConsole() {
  dom.consoleOutput.innerHTML = '';
}

function appendConsoleLine(text, type = 'log') {
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.textContent = text;
  dom.consoleOutput.appendChild(line);
  dom.consoleOutput.scrollTop = dom.consoleOutput.scrollHeight;
}

function formatConsoleArg(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'symbol') return arg.toString();
  if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
  if (typeof arg === 'object') {
    try {
      return JSON.stringify(arg, (key, value) => {
        if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
        if (typeof value === 'symbol') return value.toString();
        return value;
      }, 2);
    } catch (err) {
      return '[Circular / Complex Object]';
    }
  }
  return String(arg);
}

async function executePlaygroundCode() {
  const code = dom.codeEditor.value;
  if (!code.trim()) {
    showToast('Please enter some code to run', 'info');
    return;
  }

  clearConsole();
  appendConsoleLine(`// Executing JavaScript at ${new Date().toLocaleTimeString()}...`, 'info');

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  console.log = (...args) => {
    appendConsoleLine(args.map(formatConsoleArg).join(' '), 'log');
    originalLog.apply(console, args);
  };
  console.warn = (...args) => {
    appendConsoleLine('⚠️ ' + args.map(formatConsoleArg).join(' '), 'warn');
    originalWarn.apply(console, args);
  };
  console.error = (...args) => {
    appendConsoleLine('❌ ' + args.map(formatConsoleArg).join(' '), 'error');
    originalError.apply(console, args);
  };
  console.info = (...args) => {
    appendConsoleLine('ℹ️ ' + args.map(formatConsoleArg).join(' '), 'info');
    originalInfo.apply(console, args);
  };

  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const runner = new AsyncFunction(code);
    const result = await runner();

    if (result !== undefined) {
      appendConsoleLine(`← Returned: ${formatConsoleArg(result)}`, 'return');
    }
  } catch (err) {
    appendConsoleLine(`❌ Runtime Error: ${err.message}`, 'error');
    if (err.stack) {
      const relevantStack = err.stack.split('\n').slice(0, 3).join('\n');
      appendConsoleLine(relevantStack, 'info');
    }
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
    console.info = originalInfo;
  }
}

// ============================================================================
// Utilities
// ============================================================================
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 2200);
}

// Start application
window.addEventListener('DOMContentLoaded', init);
