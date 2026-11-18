/**
 * SkillSwap — Exchanges Management & Notifications Page Controller
 */

import {
  getState,
  saveState,
  initWorkspaceShell,
  renderAvatar,
  renderStatusLabel,
  openModal,
  closeModal,
  openExchangeModal,
  showToast,
  escapeHtml,
  icon
} from './main.js';

const page = document.body.dataset.page;

if (page === 'exchanges') {
  initWorkspaceShell('exchanges', 'My Exchanges');
  initExchangesPage();
}

if (page === 'notifications') {
  initWorkspaceShell('notifications', 'Notifications');
  initNotificationsPage();
}

/* ==========================================================================
   My Exchanges Page
   ========================================================================== */
function initExchangesPage() {
  let activeFilter = 'all';

  const tabsEl = document.getElementById('exchangeFilterTabs');
  const gridEl = document.getElementById('exchangesGrid');
  const newSwapBtn = document.getElementById('proposeNewExchangeBtn');

  newSwapBtn?.addEventListener('click', () => {
    const state = getState();
    const select = document.getElementById('newSwapPartnerSelect');
    if (select) {
      select.innerHTML = state.partners
        .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — ${escapeHtml(p.skillOffered)}</option>`)
        .join('');
    }
    openModal('quickExchangePickerModal');
  });

  document.querySelectorAll('[data-close-picker]').forEach((b) => {
    b.addEventListener('click', () => closeModal('quickExchangePickerModal'));
  });

  document.getElementById('continueToSwapBtn')?.addEventListener('click', () => {
    const partnerId = document.getElementById('newSwapPartnerSelect')?.value;
    closeModal('quickExchangePickerModal');
    if (partnerId) openExchangeModal(partnerId);
  });

  function renderTabs() {
    if (!tabsEl) return;
    const state = getState();
    const counts = {
      all: state.exchanges.length,
      pending: state.exchanges.filter((e) => e.status === 'pending').length,
      accepted: state.exchanges.filter((e) => e.status === 'accepted').length,
      completed: state.exchanges.filter((e) => e.status === 'completed').length,
      rejected: state.exchanges.filter((e) => e.status === 'rejected').length
    };
    const items = [
      { key: 'all', label: `All (${counts.all})` },
      { key: 'pending', label: `Pending (${counts.pending})` },
      { key: 'accepted', label: `Accepted (${counts.accepted})` },
      { key: 'completed', label: `Completed (${counts.completed})` },
      { key: 'rejected', label: `Rejected (${counts.rejected})` }
    ];

    tabsEl.innerHTML = items
      .map(
        (t) => `
      <button type="button" class="filter-tab ${activeFilter === t.key ? 'active' : ''}" data-ex-tab="${t.key}">
        ${t.label}
      </button>
    `
      )
      .join('');

    tabsEl.querySelectorAll('[data-ex-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-ex-tab');
        renderTabs();
        renderList();
      });
    });
  }

  function renderList() {
    if (!gridEl) return;
    const state = getState();
    const filtered =
      activeFilter === 'all' ? state.exchanges : state.exchanges.filter((e) => e.status === activeFilter);

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state" style="grid-column:1 / -1;">
          <div class="empty-state-icon">${icon('repeat')}</div>
          <h3>No ${activeFilter === 'all' ? '' : activeFilter} exchanges yet</h3>
          <p>Discover partners on Explore Skills and send an exchange request to start learning together.</p>
          <a href="explore.html" class="btn btn-primary">Explore Skills</a>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = filtered
      .map(
        (ex) => `
      <article class="exchange-card">
        <div class="exchange-card-top">
          <div class="exchange-partner-info">
            ${renderAvatar({ name: ex.partnerName, avatar: ex.partnerAvatar })}
            <div>
              <strong style="display:block;font-size:15px;">${escapeHtml(ex.partnerName)}</strong>
              <span style="font-size:13px;color:var(--text-muted);">${ex.direction === 'incoming' ? 'Incoming request' : 'Sent by you'} · ${escapeHtml(ex.schedule)}</span>
            </div>
          </div>
          ${renderStatusLabel(ex.status)}
        </div>

        <div class="exchange-skills-box">
          <div class="exchange-skill-col">
            <span>Skill You Learn</span>
            <strong>${escapeHtml(ex.skillToLearn)}</strong>
          </div>
          <div class="exchange-skill-col">
            <span>Skill You Teach</span>
            <strong>${escapeHtml(ex.skillToTeach)}</strong>
          </div>
        </div>

        <p style="font-size:13px;color:var(--text-secondary);">${escapeHtml(ex.note || 'No additional notes.')}</p>

        <div class="exchange-card-footer">
          <span class="exchange-date">${escapeHtml(ex.createdAt)}</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${
              ex.status === 'pending' && ex.direction === 'incoming'
                ? `<button type="button" class="btn btn-success btn-sm" data-set-status="accepted" data-id="${escapeHtml(ex.id)}">Accept</button>
                   <button type="button" class="btn btn-danger btn-sm" data-set-status="rejected" data-id="${escapeHtml(ex.id)}">Reject</button>`
                : ''
            }
            ${
              ex.status === 'accepted'
                ? `<button type="button" class="btn btn-success btn-sm" data-set-status="completed" data-id="${escapeHtml(ex.id)}">Mark Completed</button>`
                : ''
            }
            <button type="button" class="btn btn-secondary btn-sm" data-view-details="${escapeHtml(ex.id)}">View Details</button>
          </div>
        </div>
      </article>
    `
      )
      .join('');

    gridEl.querySelectorAll('[data-set-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const nextStatus = btn.getAttribute('data-set-status');
        const st = getState();
        const item = st.exchanges.find((e) => e.id === id);
        if (!item) return;
        item.status = nextStatus;
        st.notifications.unshift({
          id: `n-${Date.now()}`,
          type: nextStatus === 'completed' ? 'completed' : nextStatus === 'accepted' ? 'accepted' : 'request',
          title: `Exchange with ${item.partnerName} marked ${nextStatus}`,
          body: `${item.skillToLearn} ↔ ${item.skillToTeach}`,
          time: 'Just now',
          read: false,
          link: 'exchanges.html'
        });
        saveState(st);
        showToast(`Exchange marked ${nextStatus}.`, nextStatus === 'rejected' ? 'info' : 'success');
        renderTabs();
        renderList();
        window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
      });
    });

    gridEl.querySelectorAll('[data-view-details]').forEach((btn) => {
      btn.addEventListener('click', () => showExchangeDetails(btn.getAttribute('data-view-details')));
    });
  }

  function showExchangeDetails(exchangeId) {
    const st = getState();
    const ex = st.exchanges.find((e) => e.id === exchangeId);
    if (!ex) return;
    const body = document.getElementById('exchangeDetailsBody');
    if (body) {
      body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${renderAvatar({ name: ex.partnerName, avatar: ex.partnerAvatar })}
            <div>
              <strong style="display:block;font-size:16px;">${escapeHtml(ex.partnerName)}</strong>
              <span style="font-size:13px;color:var(--text-muted);">${escapeHtml(ex.createdAt)}</span>
            </div>
          </div>
          ${renderStatusLabel(ex.status)}
        </div>
        <div class="detail-list">
          <div class="detail-item"><span class="detail-label">Skill Being Learned</span><span class="detail-value">${escapeHtml(ex.skillToLearn)}</span></div>
          <div class="detail-item"><span class="detail-label">Skill Being Taught</span><span class="detail-value">${escapeHtml(ex.skillToTeach)}</span></div>
          <div class="detail-item"><span class="detail-label">Schedule</span><span class="detail-value">${escapeHtml(ex.schedule)}</span></div>
          <div class="detail-item"><span class="detail-label">Direction</span><span class="detail-value">${ex.direction === 'incoming' ? 'Incoming Request' : 'Outgoing Request'}</span></div>
        </div>
        <div>
          <strong style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Exchange Note</strong>
          <p style="font-size:14px;color:var(--text-secondary);">${escapeHtml(ex.note)}</p>
        </div>
      `;
    }
    const msgLink = document.getElementById('detailsMessagePartnerLink');
    if (msgLink) msgLink.href = `messages.html?partner=${encodeURIComponent(ex.partnerId)}`;
    openModal('exchangeDetailsModal');
  }

  document.querySelectorAll('[data-close-details]').forEach((b) => {
    b.addEventListener('click', () => closeModal('exchangeDetailsModal'));
  });

  renderTabs();
  renderList();
  window.addEventListener('skillswap:state-updated', () => {
    renderTabs();
    renderList();
  });
}

/* ==========================================================================
   Notifications Page
   ========================================================================== */
function initNotificationsPage() {
  let filter = 'all';
  const tabsEl = document.getElementById('notifFilterTabs');
  const listEl = document.getElementById('notificationsList');

  document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
    const st = getState();
    st.notifications.forEach((n) => {
      n.read = true;
    });
    saveState(st);
    showToast('All notifications marked as read.', 'success');
    renderNotifs();
    window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
  });

  function renderTabs() {
    if (!tabsEl) return;
    const st = getState();
    const unreadCount = st.notifications.filter((n) => !n.read).length;
    const tabs = [
      { key: 'all', label: `All (${st.notifications.length})` },
      { key: 'unread', label: `Unread (${unreadCount})` },
      { key: 'request', label: 'Requests' },
      { key: 'message', label: 'Messages' }
    ];
    tabsEl.innerHTML = tabs
      .map((t) => `<button type="button" class="filter-tab ${filter === t.key ? 'active' : ''}" data-notif-tab="${t.key}">${t.label}</button>`)
      .join('');

    tabsEl.querySelectorAll('[data-notif-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = btn.getAttribute('data-notif-tab');
        renderTabs();
        renderNotifs();
      });
    });
  }

  function renderNotifs() {
    if (!listEl) return;
    const st = getState();
    const items = st.notifications.filter((n) => {
      if (filter === 'unread') return !n.read;
      if (filter === 'request') return n.type === 'request' || n.type === 'accepted' || n.type === 'completed';
      if (filter === 'message') return n.type === 'message';
      return true;
    });

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="border:none;">
          <div class="empty-state-icon">${icon('bell')}</div>
          <h3>No notifications in this view</h3>
          <p>When peers send exchange requests or messages, updates will appear here.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = items
      .map((n) => {
        const ic = n.type === 'message' ? 'message' : n.type === 'accepted' || n.type === 'completed' ? 'checkCircle' : 'repeat';
        return `
          <div class="notification-row ${n.read ? '' : 'unread'}">
            <div class="notification-left">
              <div class="notification-icon">${icon(ic)}</div>
              <div class="notification-body">
                <strong>${escapeHtml(n.title)}</strong>
                <p>${escapeHtml(n.body)}</p>
                <span class="notification-time">${escapeHtml(n.time)} · ${n.read ? 'Read' : 'Unread'}</span>
              </div>
            </div>
            <div class="notification-actions">
              ${
                !n.read
                  ? `<button type="button" class="btn btn-secondary btn-sm" data-mark-read="${escapeHtml(n.id)}">Mark as read</button>`
                  : ''
              }
              <a href="${escapeHtml(n.link || 'exchanges.html')}" class="btn btn-ghost btn-sm">View</a>
            </div>
          </div>
        `;
      })
      .join('');

    listEl.querySelectorAll('[data-mark-read]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-mark-read');
        const current = getState();
        const item = current.notifications.find((n) => n.id === id);
        if (item) item.read = true;
        saveState(current);
        renderTabs();
        renderNotifs();
        window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
      });
    });
  }

  renderTabs();
  renderNotifs();
}
