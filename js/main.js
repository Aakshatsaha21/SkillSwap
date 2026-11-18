/**
 * SkillSwap — Core State Store, Shared Components & UI Utilities
 * Pure Vanilla JavaScript (ES Module) backed by LocalStorage for demo state.
 */

export const STORAGE_KEY = 'skillswap_state_v1';
export const THEME_KEY = 'skillswap_theme';

// Crisp Lucide-style inline SVG icons
const ICONS = {
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  compass: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  repeat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  message: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  xCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  checkCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

export function icon(name) {
  return ICONS[name] || '';
}

export const DEMO_PARTNERS = [
  {
    id: 'maya',
    name: 'Maya Lin',
    role: 'Brand & UI/UX Designer',
    location: 'Seattle, WA',
    avatar: '/src/assets/images/avatar_maya_1795016260126.jpg',
    category: 'Graphic Design',
    skillOffered: 'Graphic Design & Figma Systems',
    skillsTeach: ['Graphic Design', 'Figma Systems', 'Brand Identity'],
    skillWanted: 'Python Automation',
    skillsLearn: ['Python', 'Data Visualization'],
    level: 'Advanced',
    availability: 'Tue & Thu evenings (PST)',
    rating: 4.9,
    reviewCount: 28,
    popularity: 168,
    bio: 'Senior product designer with 6 years building design systems for early-stage SaaS teams. Happy to review portfolios, teach Figma auto-layout, and trade critiques for Python scripting lessons.',
    reviews: [
      { author: 'Daniel Kim', rating: 5.0, date: 'Oct 2026', text: 'Maya broke down typography hierarchy and component tokens in two focused sessions. Clear, practical feedback.' },
      { author: 'Priya Nair', rating: 4.8, date: 'Sep 2026', text: 'Structured our design swap around real portfolio work. Learned more in 3 hours than in months of tutorials.' }
    ]
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Backend & Python Mentor',
    location: 'Austin, TX',
    avatar: '/src/assets/images/avatar_marcus_1795016260633.jpg',
    category: 'Programming',
    skillOffered: 'Python & Data Engineering',
    skillsTeach: ['Python', 'SQL', 'API Architecture'],
    skillWanted: 'Video Editing',
    skillsLearn: ['Video Editing', 'Color Grading'],
    level: 'Advanced',
    availability: 'Mon, Wed evenings & Sat mornings',
    rating: 4.9,
    reviewCount: 34,
    popularity: 184,
    bio: 'Software engineer specializing in Python data pipelines and clean backend APIs. Looking to learn clean pacing and color grading for technical tutorial videos.',
    reviews: [
      { author: 'Hannah Brooks', rating: 5.0, date: 'Oct 2026', text: 'Marcus helped me go from zero Python knowledge to writing automated CSV analysis scripts for my lab.' },
      { author: 'Omar Farooq', rating: 4.9, date: 'Aug 2026', text: 'Patient code reviews and realistic exercises every week.' }
    ]
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Frontend Architect & Photographer',
    location: 'Berlin · Remote',
    avatar: '/src/assets/images/avatar_elena_1795016260545.jpg',
    category: 'Web Development',
    skillOffered: 'Modern HTML, CSS & JavaScript',
    skillsTeach: ['Web Development', 'CSS Architecture', 'Accessibility'],
    skillWanted: 'Digital Marketing',
    skillsLearn: ['Digital Marketing', 'SEO Strategy'],
    level: 'Intermediate',
    availability: 'Weekdays 17:00–20:00 CET',
    rating: 4.8,
    reviewCount: 19,
    popularity: 146,
    bio: 'Frontend developer focused on responsive layouts, semantic HTML, and fast Vanilla JS interfaces. Hoping to partner with someone skilled in organic growth and SEO.',
    reviews: [
      { author: 'Lucas Meyer', rating: 4.8, date: 'Oct 2026', text: 'Elena completely demystified CSS Grid and responsive breakpoints in one paired session.' }
    ]
  },
  {
    id: 'arjun',
    name: 'Arjun Patel',
    role: 'Video Editor & Motion Lead',
    location: 'Toronto, ON',
    avatar: '/src/assets/images/avatar_arjun_1795016261246.jpg',
    category: 'Video Editing',
    skillOffered: 'Video Editing & Storytelling',
    skillsTeach: ['Video Editing', 'DaVinci Resolve', 'Motion Graphics'],
    skillWanted: 'Web Development',
    skillsLearn: ['Web Development', 'JavaScript'],
    level: 'Advanced',
    availability: 'Weekends & Friday afternoons',
    rating: 4.9,
    reviewCount: 23,
    popularity: 159,
    bio: 'Commercial editor cutting documentary shorts and product launches. Excited to trade timeline workflows and sound design tips for interactive web development.',
    reviews: [
      { author: 'Claire Dubois', rating: 5.0, date: 'Sep 2026', text: 'Arjun showed me keyboard shortcuts and audio ducking tricks that cut my editing time in half.' }
    ]
  },
  {
    id: 'sofia',
    name: 'Sofia Alvarez',
    role: 'Growth & Content Strategist',
    location: 'Chicago, IL',
    avatar: '',
    category: 'Digital Marketing',
    skillOffered: 'Digital Marketing & SEO',
    skillsTeach: ['Digital Marketing', 'Content Strategy', 'Analytics'],
    skillWanted: 'Graphic Design',
    skillsLearn: ['Graphic Design', 'Illustration'],
    level: 'Intermediate',
    availability: 'Mon–Thu mornings (CST)',
    rating: 4.7,
    reviewCount: 15,
    popularity: 121,
    bio: 'Performance marketer helping indie creators build repeatable launch funnels and search content. Looking to sharpen visual layout and editorial illustration skills.',
    reviews: [
      { author: 'Noah Carter', rating: 4.7, date: 'Sep 2026', text: 'Gave me a clear 30-day SEO checklist I actually stuck to.' }
    ]
  },
  {
    id: 'liam',
    name: "Liam O'Connor",
    role: 'Editorial & Portrait Photographer',
    location: 'Dublin · Remote',
    avatar: '',
    category: 'Photography',
    skillOffered: 'Portrait & Studio Photography',
    skillsTeach: ['Photography', 'Lightroom Workflow', 'Lighting Setup'],
    skillWanted: 'Python',
    skillsLearn: ['Python', 'Automation'],
    level: 'Intermediate',
    availability: 'Weekends & Tue afternoons',
    rating: 4.8,
    reviewCount: 21,
    popularity: 132,
    bio: 'Documentary photographer teaching natural window lighting, framing, and Lightroom color profiles. Wanting to automate photo archiving with Python.',
    reviews: [
      { author: 'Grace Park', rating: 4.9, date: 'Aug 2026', text: 'Learned how to shoot crisp portraits with a single reflector and window light.' }
    ]
  },
  {
    id: 'nadia',
    name: 'Nadia Kim',
    role: 'UI Prototyper & Student',
    location: 'Seoul · Remote',
    avatar: '',
    category: 'Graphic Design',
    skillOffered: 'Design Systems & Wireframing',
    skillsTeach: ['Wireframing', 'Graphic Design', 'Presentation Design'],
    skillWanted: 'Photography',
    skillsLearn: ['Photography', 'Product Shots'],
    level: 'Beginner',
    availability: 'Flexible daily slots',
    rating: 4.6,
    reviewCount: 11,
    popularity: 98,
    bio: 'Industrial design graduate trading clean pitch-deck design and rapid wireframing for beginner-friendly product photography guidance.',
    reviews: [
      { author: 'Ethan Shaw', rating: 4.6, date: 'Oct 2026', text: 'Super encouraging and organized session notes.' }
    ]
  },
  {
    id: 'david',
    name: 'David Morales',
    role: 'Data Analyst & SQL Mentor',
    location: 'Denver, CO',
    avatar: '',
    category: 'Programming',
    skillOffered: 'SQL & Spreadsheet Modeling',
    skillsTeach: ['SQL', 'Programming', 'Dashboard Metrics'],
    skillWanted: 'Video Editing',
    skillsLearn: ['Video Editing', 'YouTube Pacing'],
    level: 'Intermediate',
    availability: 'Wed & Sun evenings (MST)',
    rating: 4.8,
    reviewCount: 17,
    popularity: 116,
    bio: 'Analytics lead who loves turning messy datasets into clear SQL queries. Looking to start a technical channel and learn crisp video editing.',
    reviews: [
      { author: 'Tessa Wright', rating: 4.8, date: 'Oct 2026', text: 'Finally understood window functions and joins with practical examples.' }
    ]
  }
];

function createInitialState() {
  const defaultUser = {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex@skillswap.edu',
    location: 'San Francisco, CA',
    bio: 'Computer science senior and data enthusiast eager to trade Python & SQL mentorship for visual design and video production craft.',
    level: 'Intermediate',
    availability: 'Weeknights 18:30–21:00 PST & Saturday mornings',
    avatar: '',
    skillsTeach: ['Python', 'SQL', 'Data Analysis'],
    skillsLearn: ['Graphic Design', 'Video Editing', 'Photography']
  };

  return {
    loggedOut: false,
    currentUser: defaultUser,
    registeredUsers: [
      {
        ...defaultUser,
        password: 'Password123'
      }
    ],
    partners: DEMO_PARTNERS,
    exchanges: [
      {
        id: 'ex-101',
        partnerId: 'maya',
        partnerName: 'Maya Lin',
        partnerAvatar: DEMO_PARTNERS[0].avatar,
        direction: 'incoming',
        skillToLearn: 'Graphic Design & Figma Systems',
        skillToTeach: 'Python',
        status: 'pending',
        schedule: 'Thursdays · 19:00 PST (60 min)',
        note: 'Hi Alex! I would love to trade Figma component architecture sessions for help automating CSV cleanup in Python.',
        createdAt: '2 hours ago'
      },
      {
        id: 'ex-102',
        partnerId: 'arjun',
        partnerName: 'Arjun Patel',
        partnerAvatar: DEMO_PARTNERS[3].avatar,
        direction: 'outgoing',
        skillToLearn: 'Video Editing & Storytelling',
        skillToTeach: 'SQL',
        status: 'accepted',
        schedule: 'Saturdays · 10:30 PST (60 min)',
        note: 'Weekly 1-on-1 timeline critique in exchange for SQL dashboard querying.',
        createdAt: '2 days ago'
      },
      {
        id: 'ex-103',
        partnerId: 'marcus',
        partnerName: 'Marcus Vance',
        partnerAvatar: DEMO_PARTNERS[1].avatar,
        direction: 'outgoing',
        skillToLearn: 'API Architecture',
        skillToTeach: 'Data Analysis',
        status: 'completed',
        schedule: 'Completed 4 sessions',
        note: 'Built and reviewed a complete REST service with automated reporting.',
        createdAt: 'Oct 28, 2026'
      },
      {
        id: 'ex-104',
        partnerId: 'sofia',
        partnerName: 'Sofia Alvarez',
        partnerAvatar: '',
        direction: 'incoming',
        skillToLearn: 'Digital Marketing & SEO',
        skillToTeach: 'Python',
        status: 'rejected',
        schedule: 'Weekday mornings',
        note: 'Time zone overlap did not work this month; open to rescheduling later.',
        createdAt: 'Oct 19, 2026'
      }
    ],
    conversations: [
      {
        id: 'conv-maya',
        partnerId: 'maya',
        partnerName: 'Maya Lin',
        partnerAvatar: DEMO_PARTNERS[0].avatar,
        partnerRole: 'Brand & UI/UX Designer',
        unread: 1,
        messages: [
          { id: 'm1', sender: 'partner', text: 'Hey Alex! Saw you teach Python scripting—are you still looking to learn Figma design systems?', time: '10:15 AM' },
          { id: 'm2', sender: 'me', text: 'Yes, definitely! I am building a portfolio project and want cleaner spacing and typography.', time: '10:18 AM' },
          { id: 'm3', sender: 'partner', text: 'Awesome. I sent an exchange request for Thursday evenings. Let me know if 7 PM PST works!', time: '10:22 AM' }
        ]
      },
      {
        id: 'conv-arjun',
        partnerId: 'arjun',
        partnerName: 'Arjun Patel',
        partnerAvatar: DEMO_PARTNERS[3].avatar,
        partnerRole: 'Video Editor & Motion Lead',
        unread: 0,
        messages: [
          { id: 'm4', sender: 'me', text: 'Thanks for accepting the exchange, Arjun! Ready for Saturday morning?', time: 'Yesterday' },
          { id: 'm5', sender: 'partner', text: '100% ready. Bring a 60-second raw clip and we will cut a clean narrative together.', time: 'Yesterday' }
        ]
      },
      {
        id: 'conv-elena',
        partnerId: 'elena',
        partnerName: 'Elena Rostova',
        partnerAvatar: DEMO_PARTNERS[2].avatar,
        partnerRole: 'Frontend Architect',
        unread: 0,
        messages: [
          { id: 'm6', sender: 'partner', text: 'Happy to share my CSS Grid checklist whenever you start your next frontend build.', time: 'Nov 14' }
        ]
      }
    ],
    notifications: [
      {
        id: 'n-1',
        type: 'request',
        title: 'New Exchange Request from Maya Lin',
        body: 'Maya wants to learn Python in exchange for Graphic Design & Figma Systems.',
        time: '2 hours ago',
        read: false,
        link: 'exchanges.html'
      },
      {
        id: 'n-2',
        type: 'message',
        title: 'New message from Maya Lin',
        body: '"Awesome. I sent an exchange request for Thursday evenings..."',
        time: '2 hours ago',
        read: false,
        link: 'messages.html?partner=maya'
      },
      {
        id: 'n-3',
        type: 'accepted',
        title: 'Arjun Patel accepted your exchange',
        body: 'Your Saturday Video Editing for SQL exchange is now active.',
        time: '2 days ago',
        read: true,
        link: 'exchanges.html'
      },
      {
        id: 'n-4',
        type: 'completed',
        title: 'Exchange marked completed with Marcus Vance',
        body: '4 sessions completed · Leave a review on Marcus’s profile.',
        time: 'Oct 28, 2026',
        read: true,
        link: 'profile.html?id=marcus'
      }
    ]
  };
}

export function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    const fallback = createInitialState();
    return fallback;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors in restricted modes
  }
}

export function resetDemoState() {
  const fresh = createInitialState();
  saveState(fresh);
  return fresh;
}

export function getCurrentUser() {
  const state = getState();
  return state.currentUser;
}

export function getInitials(name) {
  if (!name) return 'SS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function renderAvatar(person, sizeClass = '') {
  const name = person?.name || 'Member';
  const initials = getInitials(name);
  const src = person?.avatar;
  if (src) {
    return `
      <div class="avatar ${sizeClass}">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer"
             onerror="this.style.display='none'; this.parentElement.setAttribute('data-initials', '${escapeHtml(initials)}'); this.parentElement.textContent='${escapeHtml(initials)}';" />
      </div>
    `;
  }
  return `<div class="avatar ${sizeClass}" aria-label="${escapeHtml(name)}">${escapeHtml(initials)}</div>`;
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderStatusLabel(status) {
  const map = {
    pending: { cls: 'status-pending', label: 'Pending', ic: 'clock' },
    accepted: { cls: 'status-accepted', label: 'Accepted', ic: 'checkCircle' },
    completed: { cls: 'status-completed', label: 'Completed', ic: 'check' },
    rejected: { cls: 'status-rejected', label: 'Declined', ic: 'xCircle' }
  };
  const info = map[status] || map.pending;
  return `<span class="status-label ${info.cls}">${icon(info.ic)} ${info.label}</span>`;
}

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', isDark);
  updateThemeButtons();
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  updateThemeButtons();
  showToast(`Switched to ${isDark ? 'dark' : 'light'} mode.`, 'info');
}

function updateThemeButtons() {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    const labelEl = btn.querySelector('[data-theme-label]');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (labelEl) {
      labelEl.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    } else {
      btn.innerHTML = isDark ? icon('sun') : icon('moon');
    }
  });
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */
function ensureToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = 'info') {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  const typeClass = type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : 'toast-info';
  const ic = type === 'success' ? icon('checkCircle') : type === 'error' ? icon('xCircle') : icon('info');

  toast.className = `toast ${typeClass}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${ic}</span>
      <span>${escapeHtml(message)}</span>
    </div>
    <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  window.setTimeout(() => {
    if (toast.isConnected) toast.remove();
  }, 4000);
}

/* ==========================================================================
   Modal Utilities & Global Exchange Request / Settings Modals
   ========================================================================== */
export function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach((m) => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

export function openExchangeModal(partnerId) {
  const state = getState();
  const partner = state.partners.find((p) => p.id === partnerId) || state.partners[0];
  const user = state.currentUser;
  if (!partner) return;

  let modal = document.getElementById('globalExchangeModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalExchangeModal';
    modal.className = 'modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'exchangeModalTitle');
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal('globalExchangeModal');
    });
  }

  const userSkills = user.skillsTeach && user.skillsTeach.length ? user.skillsTeach : ['Python', 'Web Development', 'Data Analysis'];
  const partnerSkills = partner.skillsTeach && partner.skillsTeach.length ? partner.skillsTeach : [partner.skillOffered];

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 id="exchangeModalTitle">Send Exchange Request</h3>
        <button type="button" class="icon-btn" data-close-exchange-modal aria-label="Close modal">${icon('close')}</button>
      </div>
      <form id="globalExchangeForm">
        <div class="modal-body">
          <div style="display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid var(--border-hairline);">
            ${renderAvatar(partner)}
            <div>
              <strong style="display:block;font-size:15px;">${escapeHtml(partner.name)}</strong>
              <span style="font-size:13px;color:var(--text-muted);">${escapeHtml(partner.role)} · ${escapeHtml(partner.location)}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="exLearnSelect">Skill You Want to Learn</label>
            <select id="exLearnSelect" class="form-select" required>
              ${partnerSkills.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="exTeachSelect">Skill You Can Teach in Exchange</label>
            <select id="exTeachSelect" class="form-select" required>
              ${userSkills.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="exScheduleInput">Preferred Schedule</label>
            <input id="exScheduleInput" type="text" class="form-input" value="Weeknights · 60 min live session" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="exNoteInput">Introductory Note</label>
            <textarea id="exNoteInput" class="form-textarea" placeholder="Introduce yourself and share what you'd like to focus on..." required>Hi ${escapeHtml(partner.name.split(' ')[0])}, I would love to learn ${escapeHtml(partnerSkills[0])} and share ${escapeHtml(userSkills[0])} in return.</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-close-exchange-modal>Cancel</button>
          <button type="submit" class="btn btn-primary">Send Request</button>
        </div>
      </form>
    </div>
  `;

  modal.querySelectorAll('[data-close-exchange-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal('globalExchangeModal'));
  });

  modal.querySelector('#globalExchangeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const learn = modal.querySelector('#exLearnSelect').value;
    const teach = modal.querySelector('#exTeachSelect').value;
    const schedule = modal.querySelector('#exScheduleInput').value.trim();
    const note = modal.querySelector('#exNoteInput').value.trim();

    const current = getState();
    const newExchange = {
      id: `ex-${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerAvatar: partner.avatar,
      direction: 'outgoing',
      skillToLearn: learn,
      skillToTeach: teach,
      status: 'pending',
      schedule: schedule || 'Flexible schedule',
      note,
      createdAt: 'Just now'
    };

    current.exchanges.unshift(newExchange);
    current.notifications.unshift({
      id: `n-${Date.now()}`,
      type: 'request',
      title: `Exchange Request Sent to ${partner.name}`,
      body: `Proposed trading ${teach} for ${learn}.`,
      time: 'Just now',
      read: false,
      link: 'exchanges.html'
    });
    saveState(current);
    closeModal('globalExchangeModal');
    showToast(`Exchange request sent to ${partner.name}!`, 'success');
    window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
  });

  openModal('globalExchangeModal');
}

export function openSettingsModal() {
  const state = getState();
  const user = state.currentUser;

  let modal = document.getElementById('globalSettingsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalSettingsModal';
    modal.className = 'modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'settingsModalTitle');
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal('globalSettingsModal');
    });
  }

  const isDark = document.documentElement.classList.contains('dark');

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 id="settingsModalTitle">Account & Workspace Settings</h3>
        <button type="button" class="icon-btn" data-close-settings aria-label="Close modal">${icon('close')}</button>
      </div>
      <form id="globalSettingsForm">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label" for="setFullName">Full Name</label>
            <input id="setFullName" type="text" class="form-input" value="${escapeHtml(user.name)}" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="setLocation">Location</label>
            <input id="setLocation" type="text" class="form-input" value="${escapeHtml(user.location || 'Remote')}" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="setAvailability">Availability</label>
            <input id="setAvailability" type="text" class="form-input" value="${escapeHtml(user.availability || 'Weeknights & weekends')}" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="setBio">About Me</label>
            <textarea id="setBio" class="form-textarea">${escapeHtml(user.bio || '')}</textarea>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1px solid var(--border-hairline);border-radius:var(--radius-sm);">
            <div>
              <strong style="display:block;font-size:14px;">Appearance</strong>
              <span style="font-size:13px;color:var(--text-muted);">Current theme: ${isDark ? 'Dark' : 'Light'}</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="modalThemeToggle">Toggle Theme</button>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1px solid var(--border-hairline);border-radius:var(--radius-sm);">
            <div>
              <strong style="display:block;font-size:14px;">Demo Data Reset</strong>
              <span style="font-size:13px;color:var(--text-muted);">Restore default sample partners, chats & exchanges</span>
            </div>
            <button type="button" class="btn btn-danger btn-sm" id="modalResetDemo">Reset Demo</button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-close-settings>Cancel</button>
          <button type="submit" class="btn btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  `;

  modal.querySelectorAll('[data-close-settings]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal('globalSettingsModal'));
  });

  modal.querySelector('#modalThemeToggle').addEventListener('click', () => {
    toggleTheme();
    closeModal('globalSettingsModal');
  });

  modal.querySelector('#modalResetDemo').addEventListener('click', () => {
    resetDemoState();
    closeModal('globalSettingsModal');
    showToast('Demo data restored to defaults.', 'success');
    window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
    window.location.reload();
  });

  modal.querySelector('#globalSettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const st = getState();
    st.currentUser.name = modal.querySelector('#setFullName').value.trim() || st.currentUser.name;
    st.currentUser.location = modal.querySelector('#setLocation').value.trim() || st.currentUser.location;
    st.currentUser.availability = modal.querySelector('#setAvailability').value.trim() || st.currentUser.availability;
    st.currentUser.bio = modal.querySelector('#setBio').value.trim();
    saveState(st);
    closeModal('globalSettingsModal');
    showToast('Profile settings saved.', 'success');
    window.dispatchEvent(new CustomEvent('skillswap:state-updated'));
  });

  openModal('globalSettingsModal');
}

/* ==========================================================================
   Shared Workspace Shell (Sidebar + Topbar for Authenticated Pages)
   ========================================================================== */
export function initWorkspaceShell(activeKey, pageTitle) {
  initTheme();
  const state = getState();
  const user = state.currentUser;
  const unreadNotifications = state.notifications.filter((n) => !n.read).length;
  const unreadMessages = state.conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
  const pendingExchanges = state.exchanges.filter((e) => e.status === 'pending').length;

  const sidebarEl = document.getElementById('workspaceSidebar');
  const topbarEl = document.getElementById('workspaceTopbar');

  if (sidebarEl) {
    const navItems = [
      { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'dashboard' },
      { key: 'explore', label: 'Explore Skills', href: 'explore.html', ic: 'compass' },
      { key: 'profile', label: 'My Profile', href: 'profile.html?me=1', ic: 'user' },
      { key: 'exchanges', label: 'My Exchanges', href: 'exchanges.html', ic: 'repeat', count: pendingExchanges },
      { key: 'messages', label: 'Messages', href: 'messages.html', ic: 'message', count: unreadMessages },
      { key: 'notifications', label: 'Notifications', href: 'notifications.html', ic: 'bell', count: unreadNotifications }
    ];

    sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <a href="index.html" class="brand-mark">
         <img src="/SkillSwap/assets/icons/logo.svg" alt="SkillSwap Logo" width="28" height="28" />
          <span>SkillSwap</span>
        </a>
        <button type="button" class="icon-btn sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close navigation menu">
          ${icon('close')}
        </button>
      </div>

      <nav class="sidebar-nav" aria-label="Workspace navigation">
        ${navItems
          .map(
            (item) => `
          <a href="${item.href}" class="sidebar-link ${activeKey === item.key ? 'active' : ''}">
            <span class="sidebar-link-main">
              ${icon(item.ic)}
              <span>${item.label}</span>
            </span>
            ${item.count ? `<span class="sidebar-count" data-sidebar-count="${item.key}">${item.count}</span>` : ''}
          </a>
        `
          )
          .join('')}
      </nav>

      <div class="sidebar-footer">
        <button type="button" class="sidebar-link" id="sidebarSettingsBtn">
          <span class="sidebar-link-main">${icon('settings')} <span>Settings</span></span>
        </button>
        <button type="button" class="sidebar-link" id="sidebarLogoutBtn">
          <span class="sidebar-link-main">${icon('logout')} <span>Logout</span></span>
        </button>
      </div>
    `;

    sidebarEl.querySelector('#sidebarSettingsBtn')?.addEventListener('click', () => {
      closeSidebarDrawer();
      openSettingsModal();
    });

    sidebarEl.querySelector('#sidebarLogoutBtn')?.addEventListener('click', () => {
      const current = getState();
      current.loggedOut = true;
      saveState(current);
      window.location.href = 'login.html?loggedout=1';
    });

    sidebarEl.querySelector('#sidebarCloseBtn')?.addEventListener('click', closeSidebarDrawer);
  }

  if (topbarEl) {
    const isDark = document.documentElement.classList.contains('dark');
    topbarEl.innerHTML = `
      <div class="topbar-left">
        <button type="button" class="icon-btn sidebar-open-btn" id="sidebarOpenBtn" aria-label="Open navigation menu">
          ${icon('menu')}
        </button>
        <span class="topbar-breadcrumb">${escapeHtml(pageTitle)}</span>
      </div>
      <div class="topbar-right">
        <button type="button" class="icon-btn" data-theme-toggle aria-label="Toggle color theme">
          ${isDark ? icon('sun') : icon('moon')}
        </button>
        <a href="profile.html?me=1" class="topbar-user">
          ${renderAvatar(user, 'avatar-sm')}
          <span class="topbar-user-name" data-topbar-username>${escapeHtml(user.name)}</span>
        </a>
      </div>
    `;

    topbarEl.querySelector('#sidebarOpenBtn')?.addEventListener('click', openSidebarDrawer);
    topbarEl.querySelector('[data-theme-toggle]')?.addEventListener('click', toggleTheme);
  }

  const backdrop = document.getElementById('sidebarBackdrop');
  backdrop?.addEventListener('click', closeSidebarDrawer);

  window.addEventListener('skillswap:state-updated', () => {
    const latest = getState();
    const nameEl = document.querySelector('[data-topbar-username]');
    if (nameEl) nameEl.textContent = latest.currentUser.name;
    updateSidebarBadges(latest);
  });
}

function updateSidebarBadges(state) {
  const counts = {
    exchanges: state.exchanges.filter((e) => e.status === 'pending').length,
    messages: state.conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    notifications: state.notifications.filter((n) => !n.read).length
  };
  Object.entries(counts).forEach(([key, val]) => {
    const el = document.querySelector(`[data-sidebar-count="${key}"]`);
    if (el) {
      el.textContent = val > 0 ? String(val) : '';
      el.style.display = val > 0 ? 'inline' : 'none';
    }
  });
}

function openSidebarDrawer() {
  document.getElementById('workspaceSidebar')?.classList.add('open');
  document.getElementById('sidebarBackdrop')?.classList.add('open');
}

function closeSidebarDrawer() {
  document.getElementById('workspaceSidebar')?.classList.remove('open');
  document.getElementById('sidebarBackdrop')?.classList.remove('open');
}

/* ==========================================================================
   Landing Page Initialization (index.html)
   ========================================================================== */
export function initLandingPage() {
  initTheme();

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Theme toggles on landing page
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  // Render Featured Skill Partners
  const featuredContainer = document.getElementById('featuredPartnersGrid');
  if (featuredContainer) {
    const state = getState();
    const featured = state.partners.slice(0, 3);
    featuredContainer.innerHTML = featured
      .map(
        (partner) => `
      <article class="partner-card">
        <div class="partner-card-head">
          ${renderAvatar(partner)}
          <div class="partner-card-identity">
            <h3 class="partner-card-name">${escapeHtml(partner.name)}</h3>
            <div class="partner-card-sub">
              <span>${escapeHtml(partner.location)}</span>
              <span aria-hidden="true">·</span>
              <span class="tabular-nums">${partner.rating.toFixed(1)} rating (${partner.reviewCount})</span>
            </div>
          </div>
        </div>
        <div class="partner-exchange-summary">
          <div class="exchange-pair-row">
            <span class="exchange-pair-label">Teaches</span>
            <span class="exchange-pair-value exchange-pair-value--teach">${escapeHtml(partner.skillOffered)}</span>
          </div>
          <div class="exchange-pair-row">
            <span class="exchange-pair-label">Wants to learn</span>
            <span class="exchange-pair-value">${escapeHtml(partner.skillWanted)}</span>
          </div>
          <div class="exchange-pair-row">
            <span class="exchange-pair-label">Level</span>
            <span class="exchange-pair-value">${escapeHtml(partner.level)}</span>
          </div>
        </div>
        <p class="partner-card-desc">${escapeHtml(partner.bio)}</p>
        <div class="partner-card-actions">
          <a href="profile.html?id=${encodeURIComponent(partner.id)}" class="btn btn-secondary btn-sm">View Profile</a>
          <button type="button" class="btn btn-primary btn-sm" data-request-partner="${escapeHtml(partner.id)}">Request Swap</button>
        </div>
      </article>
    `
      )
      .join('');

    featuredContainer.querySelectorAll('[data-request-partner]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openExchangeModal(btn.getAttribute('data-request-partner'));
      });
    });
  }
}

// Auto-initialize landing page if marked in DOM
if (document.body.dataset.page === 'landing') {
  initLandingPage();
}
