/**
 * SkillSwap — Simulated Peer Messaging Interface
 */

import {
  getState,
  saveState,
  initWorkspaceShell,
  renderAvatar,
  openExchangeModal,
  escapeHtml,
  icon
} from './main.js';

initWorkspaceShell('messages', 'Messages');

const chatShell = document.getElementById('chatShell');
const convListEl = document.getElementById('conversationList');
const convSearchEl = document.getElementById('conversationSearchInput');
const chatHeaderEl = document.getElementById('chatHeader');
const chatMessagesEl = document.getElementById('chatMessages');
const composerForm = document.getElementById('chatComposerForm');
const messageInput = document.getElementById('chatMessageInput');

const params = new URLSearchParams(window.location.search);
const initialPartner = params.get('partner');

let activeConvId = null;
let searchText = '';

function initInitialSelection() {
  const st = getState();
  if (initialPartner) {
    let conv = st.conversations.find((c) => c.partnerId === initialPartner);
    if (!conv) {
      const partner = st.partners.find((p) => p.id === initialPartner);
      if (partner) {
        conv = {
          id: `conv-${partner.id}`,
          partnerId: partner.id,
          partnerName: partner.name,
          partnerAvatar: partner.avatar,
          partnerRole: partner.role,
          unread: 0,
          messages: [
            {
              id: `m-${Date.now()}`,
              sender: 'partner',
              text: `Hi ${st.currentUser.name.split(' ')[0]}! Thanks for connecting. What would you like to focus on first?`,
              time: formatTimeNow()
            }
          ]
        };
        st.conversations.unshift(conv);
        saveState(st);
      }
    }
    if (conv) {
      activeConvId = conv.id;
      chatShell?.classList.add('thread-open');
      return;
    }
  }
  activeConvId = st.conversations[0]?.id || null;
}

function formatTimeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderConversations() {
  if (!convListEl) return;
  const st = getState();
  const q = searchText.trim().toLowerCase();
  const filtered = st.conversations.filter((c) => c.partnerName.toLowerCase().includes(q));

  if (filtered.length === 0) {
    convListEl.innerHTML = `<div style="padding:20px;font-size:13px;color:var(--text-muted);text-align:center;">No matching conversations.</div>`;
    return;
  }

  convListEl.innerHTML = filtered
    .map((conv) => {
      const last = conv.messages[conv.messages.length - 1];
      return `
        <button type="button" class="conversation-item ${conv.id === activeConvId ? 'active' : ''}" data-conv-id="${escapeHtml(conv.id)}">
          ${renderAvatar({ name: conv.partnerName, avatar: conv.partnerAvatar })}
          <div class="conversation-meta">
            <div class="conversation-top">
              <span class="conversation-name">${escapeHtml(conv.partnerName)}</span>
              <span class="conversation-time">${escapeHtml(last?.time || '')}</span>
            </div>
            <div class="conversation-preview">${escapeHtml(last?.text || 'Start a conversation')}</div>
          </div>
          ${conv.unread ? `<span class="conversation-unread">${conv.unread}</span>` : ''}
        </button>
      `;
    })
    .join('');

  convListEl.querySelectorAll('[data-conv-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeConvId = btn.getAttribute('data-conv-id');
      const current = getState();
      const target = current.conversations.find((c) => c.id === activeConvId);
      if (target && target.unread > 0) {
        target.unread = 0;
        saveState(current);
        window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
      }
      chatShell?.classList.add('thread-open');
      renderConversations();
      renderActiveThread();
    });
  });
}

function renderActiveThread() {
  const st = getState();
  const conv = st.conversations.find((c) => c.id === activeConvId);

  if (!conv) {
    if (chatHeaderEl) chatHeaderEl.innerHTML = '';
    if (chatMessagesEl) {
      chatMessagesEl.innerHTML = `<div class="empty-state" style="margin:auto;border:none;"><h3>Select a conversation</h3><p>Choose a partner from the list to review messages or propose a swap.</p></div>`;
    }
    return;
  }

  if (chatHeaderEl) {
    chatHeaderEl.innerHTML = `
      <div class="chat-header-user">
        <button type="button" class="icon-btn chat-back-btn" id="chatBackBtn" aria-label="Back to conversations">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        ${renderAvatar({ name: conv.partnerName, avatar: conv.partnerAvatar })}
        <div>
          <strong style="display:block;font-size:15px;">${escapeHtml(conv.partnerName)}</strong>
          <span style="font-size:12px;color:var(--text-muted);">${escapeHtml(conv.partnerRole || 'SkillSwap Partner')}</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <a href="profile.html?id=${encodeURIComponent(conv.partnerId)}" class="btn btn-secondary btn-sm">Profile</a>
        <button type="button" class="btn btn-primary btn-sm" id="chatProposeSwapBtn">Swap</button>
      </div>
    `;

    document.getElementById('chatBackBtn')?.addEventListener('click', () => {
      chatShell?.classList.remove('thread-open');
    });

    document.getElementById('chatProposeSwapBtn')?.addEventListener('click', () => {
      openExchangeModal(conv.partnerId);
    });
  }

  if (chatMessagesEl) {
    chatMessagesEl.innerHTML = conv.messages
      .map(
        (m) => `
      <div class="message-row ${m.sender === 'me' ? 'outgoing' : 'incoming'}">
        <div class="message-bubble">${escapeHtml(m.text)}</div>
        <span class="message-time">${escapeHtml(m.time)}</span>
      </div>
    `
      )
      .join('');
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}

convSearchEl?.addEventListener('input', (e) => {
  searchText = e.target.value;
  renderConversations();
});

composerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput?.value.trim();
  if (!text || !activeConvId) return;

  const st = getState();
  const conv = st.conversations.find((c) => c.id === activeConvId);
  if (!conv) return;

  conv.messages.push({
    id: `m-${Date.now()}`,
    sender: 'me',
    text,
    time: formatTimeNow()
  });
  conv.unread = 0;
  saveState(st);

  messageInput.value = '';
  renderConversations();
  renderActiveThread();

  // Simulated reply in frontend demo
  const replyingPartnerId = conv.id;
  const partnerFirstName = conv.partnerName.split(' ')[0];
  window.setTimeout(() => {
    const latest = getState();
    const target = latest.conversations.find((c) => c.id === replyingPartnerId);
    if (!target) return;
    target.messages.push({
      id: `m-${Date.now() + 1}`,
      sender: 'partner',
      text: `Sounds great! Let's lock in a 45-minute session and share notes beforehand. — ${partnerFirstName}`,
      time: formatTimeNow()
    });
    saveState(latest);
    if (activeConvId === replyingPartnerId) {
      renderActiveThread();
    }
    renderConversations();
  }, 850);
});

initInitialSelection();
renderConversations();
renderActiveThread();
