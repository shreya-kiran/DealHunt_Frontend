// =============================================
// DealHunt – Auth Page Logic (auth.js)
// Handles: password toggle (SVG icons),
//          strength meter, real-time validation
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────
  // 1. PASSWORD TOGGLE  (SVG eye open/closed)
  // ─────────────────────────────────────────
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper  = btn.closest('.input-wrapper');
      const input    = wrapper.querySelector('input');
      const eyeOpen  = btn.querySelector('.icon-eye-open');
      const eyeClosed= btn.querySelector('.icon-eye-closed');
      if (!input) return;

      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';

      if (eyeOpen)   eyeOpen.style.display   = isHidden ? 'none'  : 'block';
      if (eyeClosed) eyeClosed.style.display = isHidden ? 'block' : 'none';
    });
  });

  // ─────────────────────────────────────────
  // 2. PASSWORD STRENGTH METER (signup only)
  // ─────────────────────────────────────────
  const passwordInput  = document.getElementById('signup-password');
  const strengthFill   = document.getElementById('strength-fill');
  const strengthLabel  = document.getElementById('strength-label');

  if (passwordInput && strengthFill && strengthLabel) {
    passwordInput.addEventListener('input', () => {
      const score = getPasswordStrength(passwordInput.value);
      const levels = [
        { width: '0%',   color: 'transparent',          label: '' },
        { width: '33%',  color: 'var(--strength-weak)',  label: 'Weak' },
        { width: '66%',  color: 'var(--strength-fair)',  label: 'Fair' },
        { width: '100%', color: 'var(--strength-strong)',label: 'Strong' },
      ];
      const lvl = levels[score];
      strengthFill.style.width      = lvl.width;
      strengthFill.style.background = lvl.color;
      strengthLabel.textContent     = lvl.label;
      strengthLabel.style.color     = lvl.color === 'transparent' ? 'var(--text-placeholder)' : lvl.color;
    });
  }

  function getPasswordStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)                               score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw))                     score++;
    return score;
  }

  // ─────────────────────────────────────────
  // 3. REAL-TIME INPUT VALIDATION HELPERS
  // ─────────────────────────────────────────
  function showError(inputEl, errorId, msg) {
    inputEl.classList.add('is-error');
    inputEl.classList.remove('is-valid');
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg;
  }

  function showValid(inputEl, errorId) {
    inputEl.classList.remove('is-error');
    inputEl.classList.add('is-valid');
    const el = document.getElementById(errorId);
    if (el) el.textContent = '';
  }

  function clearState(inputEl, errorId) {
    inputEl.classList.remove('is-error', 'is-valid');
    const el = document.getElementById(errorId);
    if (el) el.textContent = '';
  }

  // Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─────────────────────────────────────────
  // 4. LIVE VALIDATION — LOGIN PAGE
  // ─────────────────────────────────────────
  const loginEmailInput    = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');

  if (loginEmailInput) {
    loginEmailInput.addEventListener('blur', () => {
      const v = loginEmailInput.value.trim();
      if (!v)             showError(loginEmailInput, 'error-login-email', 'Email is required.');
      else if (!isValidEmail(v)) showError(loginEmailInput, 'error-login-email', 'Enter a valid email address.');
      else                showValid(loginEmailInput, 'error-login-email');
    });
    loginEmailInput.addEventListener('input', () => {
      if (loginEmailInput.classList.contains('is-error'))
        clearState(loginEmailInput, 'error-login-email');
    });
  }

  if (loginPasswordInput) {
    loginPasswordInput.addEventListener('blur', () => {
      if (!loginPasswordInput.value)
        showError(loginPasswordInput, 'error-login-password', 'Password is required.');
      else
        showValid(loginPasswordInput, 'error-login-password');
    });
    loginPasswordInput.addEventListener('input', () => {
      if (loginPasswordInput.classList.contains('is-error'))
        clearState(loginPasswordInput, 'error-login-password');
    });
  }

  // ─────────────────────────────────────────
  // 5. LIVE VALIDATION — SIGNUP PAGE
  // ─────────────────────────────────────────
  const signupName     = document.getElementById('signup-name');
  const signupEmail    = document.getElementById('signup-email');
  const signupDob      = document.getElementById('signup-dob');
  const signupPass     = document.getElementById('signup-password');
  const signupConfirm  = document.getElementById('signup-confirm-password');
  const agreeTerms     = document.getElementById('agree-terms');

  if (signupName) {
    signupName.addEventListener('blur', () => {
      const v = signupName.value.trim();
      if (!v)          showError(signupName, 'error-signup-name', 'Full name is required.');
      else if (v.length < 2) showError(signupName, 'error-signup-name', 'Name must be at least 2 characters.');
      else             showValid(signupName, 'error-signup-name');
    });
    signupName.addEventListener('input', () => clearState(signupName, 'error-signup-name'));
  }

  if (signupEmail) {
    signupEmail.addEventListener('blur', () => {
      const v = signupEmail.value.trim();
      if (!v)              showError(signupEmail, 'error-signup-email', 'Email is required.');
      else if (!isValidEmail(v)) showError(signupEmail, 'error-signup-email', 'Enter a valid email address.');
      else                 showValid(signupEmail, 'error-signup-email');
    });
    signupEmail.addEventListener('input', () => clearState(signupEmail, 'error-signup-email'));
  }

  if (signupDob) {
    signupDob.addEventListener('blur', () => {
      if (!signupDob.value) {
        showError(signupDob, 'error-signup-dob', 'Date of birth is required.');
      } else {
        const age = getAge(signupDob.value);
        if (age < 13) showError(signupDob, 'error-signup-dob', 'You must be at least 13 years old.');
        else          showValid(signupDob, 'error-signup-dob');
      }
    });
  }

  function getAge(dobString) {
    const dob  = new Date(dobString);
    const today= new Date();
    let age    = today.getFullYear() - dob.getFullYear();
    const m    = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  if (signupPass) {
    signupPass.addEventListener('blur', () => {
      if (!signupPass.value)
        showError(signupPass, 'error-signup-password', 'Password is required.');
      else if (signupPass.value.length < 8)
        showError(signupPass, 'error-signup-password', 'Must be at least 8 characters.');
      else
        showValid(signupPass, 'error-signup-password');
    });
    signupPass.addEventListener('input', () => clearState(signupPass, 'error-signup-password'));
  }

  if (signupConfirm) {
    signupConfirm.addEventListener('blur', () => {
      if (!signupConfirm.value)
        showError(signupConfirm, 'error-confirm-password', 'Please confirm your password.');
      else if (signupPass && signupConfirm.value !== signupPass.value)
        showError(signupConfirm, 'error-confirm-password', 'Passwords do not match.');
      else
        showValid(signupConfirm, 'error-confirm-password');
    });
    signupConfirm.addEventListener('input', () => clearState(signupConfirm, 'error-confirm-password'));
  }

  // ─────────────────────────────────────────
  // 6. FORM SUBMIT — LOGIN
  // ─────────────────────────────────────────
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email    = loginEmailInput ? loginEmailInput.value.trim() : '';
      const password = loginPasswordInput ? loginPasswordInput.value : '';
      let valid = true;

      if (!email || !isValidEmail(email)) {
        showError(loginEmailInput, 'error-login-email', 'Enter a valid email address.'); valid = false;
      }
      if (!password) {
        showError(loginPasswordInput, 'error-login-password', 'Password is required.'); valid = false;
      }
      if (!valid) return;

      setLoading('btn-login', true);
      // TODO: replace with actual API call
      setTimeout(() => {
        setLoading('btn-login', false);
        console.log('Login submitted:', { email });
      }, 1500);
    });
  }

  // ─────────────────────────────────────────
  // 7. FORM SUBMIT — SIGNUP
  // ─────────────────────────────────────────
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name    = signupName    ? signupName.value.trim()   : '';
      const email   = signupEmail   ? signupEmail.value.trim()  : '';
      const dob     = signupDob     ? signupDob.value           : '';
      const pass    = signupPass    ? signupPass.value          : '';
      const confirm = signupConfirm ? signupConfirm.value       : '';

      if (!name) { showError(signupName, 'error-signup-name', 'Full name is required.'); valid = false; }
      if (!email || !isValidEmail(email)) { showError(signupEmail, 'error-signup-email', 'Enter a valid email address.'); valid = false; }
      if (!dob)  { showError(signupDob, 'error-signup-dob', 'Date of birth is required.'); valid = false; }
      if (!pass || pass.length < 8) { showError(signupPass, 'error-signup-password', 'Must be at least 8 characters.'); valid = false; }
      if (pass !== confirm) { showError(signupConfirm, 'error-confirm-password', 'Passwords do not match.'); valid = false; }
      if (agreeTerms && !agreeTerms.checked) {
        const el = document.getElementById('error-terms');
        if (el) el.textContent = 'You must accept the terms to continue.';
        valid = false;
      }

      if (!valid) return;

      setLoading('btn-signup', true);
      // TODO: replace with actual API call
      setTimeout(() => {
        setLoading('btn-signup', false);
        console.log('Signup submitted:', { name, email, dob });
      }, 1500);
    });
  }

  // ─────────────────────────────────────────
  // 8. LOADING STATE HELPER
  // ─────────────────────────────────────────
  function setLoading(btnId, loading) {
    const btn    = document.getElementById(btnId);
    if (!btn) return;
    const text   = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    btn.disabled = loading;
    if (text)   text.style.display   = loading ? 'none'  : 'inline';
    if (loader) loader.style.display = loading ? 'inline-block' : 'none';
  }

  // ─────────────────────────────────────────
  // 9. SSO STUBS
  // ─────────────────────────────────────────
  ['btn-google-login', 'btn-google-signup'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => console.log('Google SSO — connect to backend'));
  });
  ['btn-apple-login', 'btn-apple-signup'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => console.log('Apple SSO — connect to backend'));
  });

});
