/**
 * SkillSwap — Authentication Logic (Login & Sign Up Validation + Demo Session)
 */

import { getState, saveState, initTheme, toggleTheme, showToast, openModal, closeModal } from './main.js';

initTheme();
document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', toggleTheme);
});

// Password Show/Hide Toggles
document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-toggle-password');
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
});

function setFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(`${inputId}Error`);
  if (input) input.classList.toggle('input-error', Boolean(message));
  if (errEl) errEl.textContent = message || '';
}

function showAuthBanner(bannerId, message, isSuccess = false) {
  const el = document.getElementById(bannerId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('auth-alert-error', 'auth-alert-success');
  el.classList.add(isSuccess ? 'auth-alert-success' : 'auth-alert-error', 'visible');
}

function clearAuthBanner(bannerId) {
  const el = document.getElementById(bannerId);
  if (!el) return;
  el.classList.remove('visible');
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ==========================================================================
   Login Page Handler
   ========================================================================== */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('loggedout') === '1') {
    showToast('You have signed out of SkillSwap.', 'info');
  }

  // Prefill remembered email
  const rememberedEmail = localStorage.getItem('skillswap_remember_email');
  if (rememberedEmail) {
    const emailInput = document.getElementById('loginEmail');
    const rememberBox = document.getElementById('rememberMe');
    if (emailInput) emailInput.value = rememberedEmail;
    if (rememberBox) rememberBox.checked = true;
  }

  // Demo Credential Fill Button
  document.getElementById('fillDemoCredentials')?.addEventListener('click', () => {
    document.getElementById('loginEmail').value = 'alex@skillswap.edu';
    document.getElementById('loginPassword').value = 'Password123';
    setFieldError('loginEmail', '');
    setFieldError('loginPassword', '');
    clearAuthBanner('loginBanner');
    showToast('Demo credentials filled. Click Login to continue.', 'info');
  });

  // Forgot Password Modal
  document.getElementById('forgotPasswordBtn')?.addEventListener('click', () => {
    openModal('forgotPasswordModal');
  });
  document.querySelectorAll('[data-close-forgot]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal('forgotPasswordModal'));
  });
  document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const resetEmail = document.getElementById('resetEmailInput').value.trim();
    if (!emailRegex.test(resetEmail)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    closeModal('forgotPasswordModal');
    showToast(`Demo reset link simulated for ${resetEmail}.`, 'success');
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAuthBanner('loginBanner');

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    let valid = true;
    if (!emailRegex.test(email)) {
      setFieldError('loginEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError('loginEmail', '');
    }

    if (!password || password.length < 6) {
      setFieldError('loginPassword', 'Password must be at least 6 characters.');
      valid = false;
    } else {
      setFieldError('loginPassword', '');
    }

    if (!valid) return;

    const state = getState();
    const foundUser = state.registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      showAuthBanner('loginBanner', 'Invalid email or password. Try the demo account (alex@skillswap.edu / Password123) or sign up.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('skillswap_remember_email', email);
    } else {
      localStorage.removeItem('skillswap_remember_email');
    }

    const { password: _removed, ...safeUser } = foundUser;
    state.currentUser = safeUser;
    state.loggedOut = false;
    saveState(state);

    showAuthBanner('loginBanner', 'Login successful! Redirecting to your dashboard...', true);
    window.setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 550);
  });
}

/* ==========================================================================
   Sign Up Page Handler
   ========================================================================== */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  // Quick-fill skill suggestion buttons
  document.querySelectorAll('[data-add-skill-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-add-skill-target');
      const skill = btn.getAttribute('data-skill-value');
      const input = document.getElementById(targetId);
      if (!input || !skill) return;
      const existing = input.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!existing.includes(skill)) {
        existing.push(skill);
        input.value = existing.join(', ');
      }
      setFieldError(targetId, '');
    });
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAuthBanner('signupBanner');

    const fullName = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const teachRaw = document.getElementById('signupTeach').value.trim();
    const learnRaw = document.getElementById('signupLearn').value.trim();

    let valid = true;

    if (fullName.length < 2) {
      setFieldError('signupName', 'Please enter your full name.');
      valid = false;
    } else {
      setFieldError('signupName', '');
    }

    if (!emailRegex.test(email)) {
      setFieldError('signupEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError('signupEmail', '');
    }

    if (password.length < 6) {
      setFieldError('signupPassword', 'Password must be at least 6 characters.');
      valid = false;
    } else {
      setFieldError('signupPassword', '');
    }

    if (confirmPassword !== password || !confirmPassword) {
      setFieldError('signupConfirmPassword', 'Passwords do not match.');
      valid = false;
    } else {
      setFieldError('signupConfirmPassword', '');
    }

    const skillsTeach = teachRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const skillsLearn = learnRaw.split(',').map((s) => s.trim()).filter(Boolean);

    if (skillsTeach.length === 0) {
      setFieldError('signupTeach', 'Add at least one skill you can teach.');
      valid = false;
    } else {
      setFieldError('signupTeach', '');
    }

    if (skillsLearn.length === 0) {
      setFieldError('signupLearn', 'Add at least one skill you want to learn.');
      valid = false;
    } else {
      setFieldError('signupLearn', '');
    }

    if (!valid) return;

    const state = getState();
    const duplicate = state.registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
      setFieldError('signupEmail', 'An account with this email already exists.');
      showAuthBanner('signupBanner', 'This email is already registered. Please log in instead.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: fullName,
      email,
      location: 'Remote',
      bio: `Excited to teach ${skillsTeach.join(', ')} and learn ${skillsLearn.join(', ')} through SkillSwap.`,
      level: 'Intermediate',
      availability: 'Weeknights & weekends',
      avatar: '',
      skillsTeach,
      skillsLearn
    };

    state.registeredUsers.push({ ...newUser, password });
    state.currentUser = newUser;
    state.loggedOut = false;
    state.notifications.unshift({
      id: `n-${Date.now()}`,
      type: 'accepted',
      title: `Welcome to SkillSwap, ${fullName}!`,
      body: 'Your profile is ready. Explore partners or send your first exchange request.',
      time: 'Just now',
      read: false,
      link: 'explore.html'
    });
    saveState(state);

    showAuthBanner('signupBanner', 'Account created! Launching your dashboard...', true);
    window.setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  });
}
