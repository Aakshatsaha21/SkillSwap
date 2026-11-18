/**
 * SkillSwap — Dashboard & Profile Page Controller
 */

import {
  getState,
  saveState,
  initWorkspaceShell,
  renderAvatar,
  renderStatusLabel,
  openExchangeModal,
  openSettingsModal,
  showToast,
  escapeHtml,
  icon
} from './main.js';

const page = document.body.dataset.page;

if (page === 'dashboard') {
  initWorkspaceShell('dashboard', 'Dashboard');
  renderDashboard();
  window.addEventListener('skillswap:state-updated', renderDashboard);
}

if (page === 'profile') {
  initWorkspaceShell('profile', 'Profile');
  renderProfilePage();
  window.addEventListener('skillswap:state-updated', renderProfilePage);
}

/* ==========================================================================
   Dashboard Rendering & Interactions
   ========================================================================== */
function renderDashboard() {
  const state = getState();
  const user = state.currentUser;

  const pendingReqs = state.exchanges.filter((e) => e.status === 'pending');
  const activeExchanges = state.exchanges.filter((e) => e.status === 'accepted');
  const completedCount = state.exchanges.filter((e) => e.status === 'completed').length;
  const unreadNotifs = state.notifications.filter((n) => !n.read).length;

  // Welcome Header
  const welcomeTitle = document.getElementById('welcomeHeading');
  const welcomeSub = document.getElementById('welcomeSubtext');
  if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${user.name.split(' ')[0]}`;
  if (welcomeSub) {
    welcomeSub.textContent = `${user.location || 'Remote'} · Availability: ${user.availability || 'Flexible'}`;
  }

  // KPI Counters
  setText('kpiPending', String(pendingReqs.length));
  setText('kpiActive', String(activeExchanges.length));
  setText('kpiCompleted', String(completedCount));
  setText('kpiUnread', String(unreadNotifs));

  // Profile Overview Card
  const profileSummary = document.getElementById('dashProfileSummary');
  if (profileSummary) {
    profileSummary.innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        ${renderAvatar(user, 'avatar-lg')}
        <div>
          <strong style="display:block;font-size:17px;">${escapeHtml(user.name)}</strong>
          <span style="font-size:13px;color:var(--text-muted);">${escapeHtml(user.email)} · ${escapeHtml(user.level || 'Intermediate')}</span>
        </div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">${escapeHtml(user.bio)}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="profile.html?me=1" class="btn btn-secondary btn-sm">View Full Profile</a>
        <button type="button" class="btn btn-ghost btn-sm" id="dashEditProfileBtn">Edit Details</button>
      </div>
    `;
    document.getElementById('dashEditProfileBtn')?.addEventListener('click', openSettingsModal);
  }

  // Skills I Can Teach & Want to Learn
  renderSkillChips('teachSkillsList', user.skillsTeach || [], 'teach');
  renderSkillChips('learnSkillsList', user.skillsLearn || [], 'learn');

  wireQuickAddSkill('addTeachForm', 'addTeachInput', 'teach');
  wireQuickAddSkill('addLearnForm', 'addLearnInput', 'learn');

  // Recommended Skill Partners
  const recEl = document.getElementById('recommendedPartnersList');
  if (recEl) {
    const learnLower = (user.skillsLearn || []).map((s) => s.toLowerCase());
    const scored = [...state.partners]
      .sort((a, b) => {
        const aMatch = learnLower.some((s) => a.skillOffered.toLowerCase().includes(s)) ? 1 : 0;
        const bMatch = learnLower.some((s) => b.skillOffered.toLowerCase().includes(s)) ? 1 : 0;
        return bMatch - aMatch || b.rating - a.rating;
      })
      .slice(0, 3);

    recEl.innerHTML = scored
      .map(
        (p) => `
      <div class="compact-row">
        <div class="compact-row-left">
          ${renderAvatar(p)}
          <div class="compact-row-text">
            <div class="compact-row-title">${escapeHtml(p.name)}</div>
            <div class="compact-row-meta">Teaches ${escapeHtml(p.skillOffered)} · Wants ${escapeHtml(p.skillWanted)}</div>
          </div>
        </div>
        <div class="compact-row-actions">
          <a href="profile.html?id=${encodeURIComponent(p.id)}" class="btn btn-secondary btn-sm">Profile</a>
          <button type="button" class="btn btn-primary btn-sm" data-dash-swap="${escapeHtml(p.id)}">Swap</button>
        </div>
      </div>
    `
      )
      .join('');

    recEl.querySelectorAll('[data-dash-swap]').forEach((btn) => {
      btn.addEventListener('click', () => openExchangeModal(btn.getAttribute('data-dash-swap')));
    });
  }

  // Pending Exchange Requests
  const pendingEl = document.getElementById('dashPendingList');
  if (pendingEl) {
    if (pendingReqs.length === 0) {
      pendingEl.innerHTML = `<p style="font-size:14px;color:var(--text-muted);">No pending exchange requests right now. <a href="explore.html" class="panel-link">Explore partners</a>.</p>`;
    } else {
      pendingEl.innerHTML = pendingReqs
        .slice(0, 4)
        .map(
          (ex) => `
        <div class="compact-row">
          <div class="compact-row-left">
            ${renderAvatar({ name: ex.partnerName, avatar: ex.partnerAvatar })}
            <div class="compact-row-text">
              <div class="compact-row-title">${escapeHtml(ex.partnerName)} · ${escapeHtml(ex.direction === 'incoming' ? 'Incoming' : 'Outgoing')}</div>
              <div class="compact-row-meta">Learn ${escapeHtml(ex.skillToLearn)} · Teach ${escapeHtml(ex.skillToTeach)}</div>
            </div>
          </div>
          <div class="compact-row-actions">
            ${
              ex.direction === 'incoming'
                ? `<button type="button" class="btn btn-success btn-sm" data-ex-action="accepted" data-ex-id="${escapeHtml(ex.id)}">Accept</button>
                   <button type="button" class="btn btn-danger btn-sm" data-ex-action="rejected" data-ex-id="${escapeHtml(ex.id)}">Decline</button>`
                : renderStatusLabel(ex.status)
            }
          </div>
        </div>
      `
        )
        .join('');

      pendingEl.querySelectorAll('[data-ex-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          updateExchangeStatus(btn.getAttribute('data-ex-id'), btn.getAttribute('data-ex-action'));
        });
      });
    }
  }

  // Active Exchanges
  const activeEl = document.getElementById('dashActiveList');
  if (activeEl) {
    if (activeExchanges.length === 0) {
      activeEl.innerHTML = `<p style="font-size:14px;color:var(--text-muted);">No active exchanges yet.</p>`;
    } else {
      activeEl.innerHTML = activeExchanges
        .slice(0, 3)
        .map(
          (ex) => `
        <div class="compact-row">
          <div class="compact-row-left">
            ${renderAvatar({ name: ex.partnerName, avatar: ex.partnerAvatar })}
            <div class="compact-row-text">
              <div class="compact-row-title">${escapeHtml(ex.partnerName)}</div>
              <div class="compact-row-meta">${escapeHtml(ex.skillToLearn)} ↔ ${escapeHtml(ex.skillToTeach)} · ${escapeHtml(ex.schedule)}</div>
            </div>
          </div>
          <div class="compact-row-actions">
            <a href="messages.html?partner=${encodeURIComponent(ex.partnerId)}" class="btn btn-secondary btn-sm">Message</a>
          </div>
        </div>
      `
        )
        .join('');
    }
  }

  // Recent Notifications
  const notifEl = document.getElementById('dashNotificationsList');
  if (notifEl) {
    const recent = state.notifications.slice(0, 4);
    if (recent.length === 0) {
      notifEl.innerHTML = `<p style="font-size:14px;color:var(--text-muted);">You are all caught up.</p>`;
    } else {
      notifEl.innerHTML = recent
        .map(
          (n) => `
        <div class="compact-row">
          <div class="compact-row-text">
            <div class="compact-row-title">${n.read ? '' : '• '}${escapeHtml(n.title)}</div>
            <div class="compact-row-meta">${escapeHtml(n.body)} · <span class="tabular-nums">${escapeHtml(n.time)}</span></div>
          </div>
          <a href="${escapeHtml(n.link || 'notifications.html')}" class="panel-link">Open</a>
        </div>
      `
        )
        .join('');
    }
  }
}

function renderSkillChips(containerId, skills, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (skills.length === 0) {
    container.innerHTML = `<span style="font-size:13px;color:var(--text-muted);">No skills added yet.</span>`;
    return;
  }
  container.innerHTML = skills
    .map(
      (skill) => `
    <span class="skill-item-chip">
      <span>${escapeHtml(skill)}</span>
      <button type="button" class="skill-item-remove" data-remove-skill="${escapeHtml(skill)}" data-skill-type="${type}" aria-label="Remove ${escapeHtml(skill)}">&times;</button>
    </span>
  `
    )
    .join('');

  container.querySelectorAll('[data-remove-skill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const skillName = btn.getAttribute('data-remove-skill');
      const kind = btn.getAttribute('data-skill-type');
      const st = getState();
      if (kind === 'teach') {
        st.currentUser.skillsTeach = (st.currentUser.skillsTeach || []).filter((s) => s !== skillName);
      } else {
        st.currentUser.skillsLearn = (st.currentUser.skillsLearn || []).filter((s) => s !== skillName);
      }
      saveState(st);
      showToast(`Removed "${skillName}".`, 'info');
      renderDashboard();
    });
  });
}

function wireQuickAddSkill(formId, inputId, type) {
  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  if (!form || !input || form.dataset.wired === '1') return;
  form.dataset.wired = '1';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    const st = getState();
    const list = type === 'teach' ? st.currentUser.skillsTeach || [] : st.currentUser.skillsLearn || [];
    if (!list.some((s) => s.toLowerCase() === val.toLowerCase())) {
      list.push(val);
      if (type === 'teach') st.currentUser.skillsTeach = list;
      else st.currentUser.skillsLearn = list;
      saveState(st);
      showToast(`Added "${val}" to your profile.`, 'success');
      input.value = '';
      renderDashboard();
    } else {
      showToast(`"${val}" is already listed.`, 'info');
    }
  });
}

function updateExchangeStatus(exchangeId, status) {
  const st = getState();
  const target = st.exchanges.find((e) => e.id === exchangeId);
  if (!target) return;
  target.status = status;
  st.notifications.unshift({
    id: `n-${Date.now()}`,
    type: status === 'accepted' ? 'accepted' : 'request',
    title: `Exchange with ${target.partnerName} ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
    body: `${target.skillToLearn} ↔ ${target.skillToTeach}`,
    time: 'Just now',
    read: false,
    link: 'exchanges.html'
  });
  saveState(st);
  showToast(`Exchange request ${status === 'accepted' ? 'accepted' : 'declined'}.`, status === 'accepted' ? 'success' : 'info');
  renderDashboard();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ==========================================================================
   User Profile Page (Partner Profile or Own Profile)
   ========================================================================== */
function renderProfilePage() {
  const params = new URLSearchParams(window.location.search);
  const partnerId = params.get('id');
  const isMe = params.get('me') === '1' || !partnerId;

  const state = getState();
  const partner = !isMe ? state.partners.find((p) => p.id === partnerId) || state.partners[0] : null;
  const profileData = isMe
    ? {
        id: state.currentUser.id,
        name: state.currentUser.name,
        role: 'SkillSwap Member',
        location: state.currentUser.location || 'Remote',
        avatar: state.currentUser.avatar,
        bio: state.currentUser.bio,
        skillsTeach: state.currentUser.skillsTeach || [],
        skillsLearn: state.currentUser.skillsLearn || [],
        level: state.currentUser.level || 'Intermediate',
        availability: state.currentUser.availability || 'Weeknights & weekends',
        rating: 4.9,
        reviewCount: 4,
        reviews: [
          { author: 'Marcus Vance', rating: 5.0, date: 'Oct 2026', text: 'Great teaching pace and well-prepared SQL examples.' },
          { author: 'Elena Rostova', rating: 4.8, date: 'Sep 2026', text: 'Always punctual and clear with follow-up notes.' }
        ]
      }
    : partner;

  const container = document.getElementById('profileContainer');
  if (!container || !profileData) return;

  container.innerHTML = `
    <section class="profile-header-card">
      <div class="profile-identity">
        ${renderAvatar(profileData, 'avatar-xl')}
        <div>
          <h1>${escapeHtml(profileData.name)}</h1>
          <div class="profile-meta-row">
            <span>${escapeHtml(profileData.role)}</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtml(profileData.location)}</span>
            <span aria-hidden="true">·</span>
            <span class="tabular-nums">${icon('star')} ${profileData.rating.toFixed(1)} (${profileData.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      <div class="profile-actions">
        ${
          isMe
            ? `<button type="button" class="btn btn-primary" id="editOwnProfileBtn">Edit Profile</button>
               <a href="explore.html" class="btn btn-secondary">Browse Partners</a>`
            : `<button type="button" class="btn btn-secondary" id="connectPartnerBtn">Connect & Message</button>
               <button type="button" class="btn btn-primary" id="requestSwapProfileBtn">Send Exchange Request</button>`
        }
      </div>
    </section>

    <div class="profile-grid">
      <div class="dashboard-stack">
        <section class="panel">
          <div class="panel-header">
            <h2 class="panel-title">About Me</h2>
          </div>
          <p style="font-size:15px;line-height:1.65;color:var(--text-secondary);">${escapeHtml(profileData.bio)}</p>
        </section>

        <section class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Skills Offered & Learning Goals</h2>
          </div>
          <div style="display:grid;gap:18px;">
            <div>
              <h3 style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:10px;">Skills I Can Teach</h3>
              <div class="skill-tags-wrap">
                ${(profileData.skillsTeach || []).map((s) => `<span class="skill-item-chip">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>
            <div>
              <h3 style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:10px;">Skills I Want to Learn</h3>
              <div class="skill-tags-wrap">
                ${(profileData.skillsLearn || []).map((s) => `<span class="skill-item-chip">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Experience & Availability</h2>
          </div>
          <div class="detail-list">
            <div class="detail-item">
              <span class="detail-label">Experience Level</span>
              <span class="detail-value">${escapeHtml(profileData.level)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Availability</span>
              <span class="detail-value">${escapeHtml(profileData.availability)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Location / Format</span>
              <span class="detail-value">${escapeHtml(profileData.location)} · Live 1-on-1</span>
            </div>
          </div>
        </section>
      </div>

      <div class="dashboard-stack">
        <section class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Reviews & Ratings</h2>
            <span style="font-size:13px;color:var(--text-muted);" class="tabular-nums">${profileData.rating.toFixed(1)} average</span>
          </div>
          <div id="profileReviewsList">
            ${(profileData.reviews || [])
              .map(
                (r) => `
              <div class="review-item">
                <div class="review-head">
                  <span class="review-author">${escapeHtml(r.author)} · <span style="font-weight:400;color:var(--text-muted);">${escapeHtml(r.date)}</span></span>
                  <span class="review-rating tabular-nums">${r.rating.toFixed(1)} / 5.0</span>
                </div>
                <p style="font-size:14px;color:var(--text-secondary);">${escapeHtml(r.text)}</p>
              </div>
            `
              )
              .join('')}
          </div>

          ${
            !isMe
              ? `
            <form id="addReviewForm" style="margin-top:20px;padding-top:18px;border-top:1px solid var(--border-hairline);display:grid;gap:12px;">
              <h3 style="font-size:14px;font-weight:700;">Leave a Review</h3>
              <div class="form-group">
                <label class="form-label" for="reviewRatingInput">Rating</label>
                <select id="reviewRatingInput" class="form-select">
                  <option value="5">5.0 — Exceptional Mentor</option>
                  <option value="4.5">4.5 — Very Helpful</option>
                  <option value="4">4.0 — Good Session</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="reviewCommentInput">Feedback</label>
                <textarea id="reviewCommentInput" class="form-textarea" placeholder="Share what you learned during your skill swap..." required></textarea>
              </div>
              <button type="submit" class="btn btn-secondary btn-sm">Submit Review</button>
            </form>
          `
              : ''
          }
        </section>
      </div>
    </div>
  `;

  if (isMe) {
    document.getElementById('editOwnProfileBtn')?.addEventListener('click', openSettingsModal);
  } else {
    document.getElementById('requestSwapProfileBtn')?.addEventListener('click', () => {
      openExchangeModal(profileData.id);
    });
    document.getElementById('connectPartnerBtn')?.addEventListener('click', () => {
      ensureConversation(profileData);
      window.location.href = `messages.html?partner=${encodeURIComponent(profileData.id)}`;
    });

    document.getElementById('addReviewForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const ratingVal = Number(document.getElementById('reviewRatingInput').value);
      const commentVal = document.getElementById('reviewCommentInput').value.trim();
      if (!commentVal) return;

      const st = getState();
      const target = st.partners.find((p) => p.id === profileData.id);
      if (target) {
        target.reviews.unshift({
          author: st.currentUser.name,
          rating: ratingVal,
          date: 'Nov 2026',
          text: commentVal
        });
        target.reviewCount += 1;
        saveState(st);
        showToast('Review added to profile.', 'success');
        renderProfilePage();
      }
    });
  }
}

function ensureConversation(partner) {
  const st = getState();
  const exists = st.conversations.find((c) => c.partnerId === partner.id);
  if (!exists) {
    st.conversations.unshift({
      id: `conv-${partner.id}`,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerAvatar: partner.avatar,
      partnerRole: partner.role,
      unread: 0,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'me',
          text: `Hi ${partner.name.split(' ')[0]}, I'd love to connect about trading ${partner.skillWanted} for ${partner.skillOffered}!`,
          time: 'Just now'
        }
      ]
    });
    saveState(st);
  }
}
