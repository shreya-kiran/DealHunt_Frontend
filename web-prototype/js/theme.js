/* DealHunt – Theme Manager */
(function () {
  const KEY = 'dh-theme';

  function getPreferred() {
    const stored = localStorage.getItem(KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sun  = btn.querySelector('.icon-sun');
      const moon = btn.querySelector('.icon-moon');
      if (sun)  sun.style.display  = theme === 'dark'  ? 'block' : 'none';
      if (moon) moon.style.display = theme === 'light' ? 'block' : 'none';
    });
  }

  function toggle() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    apply(cur === 'dark' ? 'light' : 'dark');
  }

  // Apply before first paint to avoid flash
  apply(getPreferred());

  window.DealHuntTheme = { toggle, apply, get: () => document.documentElement.getAttribute('data-theme') };
})();
