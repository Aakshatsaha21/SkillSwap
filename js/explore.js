/**
 * SkillSwap — Explore Skills Directory (Search, Category Filter, Level Filter, Sort)
 */

import {
  getState,
  initWorkspaceShell,
  renderAvatar,
  openExchangeModal,
  escapeHtml,
  icon
} from './main.js';

initWorkspaceShell('explore', 'Explore Skills');

const categories = [
  'All',
  'Programming',
  'Web Development',
  'Graphic Design',
  'Video Editing',
  'Photography',
  'Digital Marketing'
];

const params = new URLSearchParams(window.location.search);
let selectedCategory = categories.includes(params.get('category')) ? params.get('category') : 'All';
let searchQuery = '';
let selectedLevel = 'All';
let sortBy = 'popularity';

const searchInput = document.getElementById('exploreSearchInput');
const levelSelect = document.getElementById('exploreLevelSelect');
const sortSelect = document.getElementById('exploreSortSelect');
const categoryTabsEl = document.getElementById('exploreCategoryTabs');
const gridEl = document.getElementById('exploreSkillsGrid');
const resultsCountEl = document.getElementById('exploreResultsCount');

function renderCategoryTabs() {
  if (!categoryTabsEl) return;
  categoryTabsEl.innerHTML = categories
    .map(
      (cat) => `
    <button type="button" class="filter-tab ${selectedCategory === cat ? 'active' : ''}" data-cat="${escapeHtml(cat)}">
      ${escapeHtml(cat)}
    </button>
  `
    )
    .join('');

  categoryTabsEl.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-cat');
      renderCategoryTabs();
      renderPartners();
    });
  });
}

function renderPartners() {
  if (!gridEl) return;
  const state = getState();
  const q = searchQuery.trim().toLowerCase();

  let list = state.partners.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || p.level === selectedLevel;
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.skillOffered.toLowerCase().includes(q) ||
      p.skillWanted.toLowerCase().includes(q) ||
      p.bio.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesLevel && matchesSearch;
  });

  if (sortBy === 'popularity') {
    list.sort((a, b) => b.popularity - a.popularity);
  } else if (sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (resultsCountEl) {
    resultsCountEl.textContent = `Showing ${list.length} skill partner${list.length === 1 ? '' : 's'}`;
  }

  if (list.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-state" style="grid-column:1 / -1;">
        <div class="empty-state-icon">${icon('search')}</div>
        <h3>No matching skill partners found</h3>
        <p>Try clearing one of your category or experience level filters, or search for a broader topic like Python or Design.</p>
        <button type="button" class="btn btn-secondary" id="resetExploreFiltersBtn">Reset All Filters</button>
      </div>
    `;
    document.getElementById('resetExploreFiltersBtn')?.addEventListener('click', () => {
      selectedCategory = 'All';
      selectedLevel = 'All';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (levelSelect) levelSelect.value = 'All';
      renderCategoryTabs();
      renderPartners();
    });
    return;
  }

  gridEl.innerHTML = list
    .map(
      (partner) => `
    <article class="partner-card">
      <div class="partner-card-head">
        ${renderAvatar(partner)}
        <div class="partner-card-identity">
          <h3 class="partner-card-name">${escapeHtml(partner.name)}</h3>
          <div class="partner-card-sub">
            <span>${escapeHtml(partner.category)}</span>
            <span aria-hidden="true">·</span>
            <span class="tabular-nums">${partner.rating.toFixed(1)} rating (${partner.reviewCount})</span>
          </div>
        </div>
      </div>

      <div class="partner-exchange-summary">
        <div class="exchange-pair-row">
          <span class="exchange-pair-label">Offers</span>
          <span class="exchange-pair-value exchange-pair-value--teach">${escapeHtml(partner.skillOffered)}</span>
        </div>
        <div class="exchange-pair-row">
          <span class="exchange-pair-label">Wants to learn</span>
          <span class="exchange-pair-value">${escapeHtml(partner.skillWanted)}</span>
        </div>
        <div class="exchange-pair-row">
          <span class="exchange-pair-label">Experience</span>
          <span class="exchange-pair-value">${escapeHtml(partner.level)}</span>
        </div>
      </div>

      <p class="partner-card-desc">${escapeHtml(partner.bio)}</p>

      <div class="partner-card-actions">
        <a href="profile.html?id=${encodeURIComponent(partner.id)}" class="btn btn-secondary btn-sm">View Profile</a>
        <button type="button" class="btn btn-primary btn-sm" data-explore-request="${escapeHtml(partner.id)}">Send Request</button>
      </div>
    </article>
  `
    )
    .join('');

  gridEl.querySelectorAll('[data-explore-request]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openExchangeModal(btn.getAttribute('data-explore-request'));
    });
  });
}

searchInput?.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderPartners();
});

levelSelect?.addEventListener('change', (e) => {
  selectedLevel = e.target.value;
  renderPartners();
});

sortSelect?.addEventListener('change', (e) => {
  sortBy = e.target.value;
  renderPartners();
});

renderCategoryTabs();
renderPartners();
