/* ERA EXECUTIVE SEARCH INC. — Shared JS */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── ACTIVE NAV LINK ──
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  // ── MOBILE MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay    = document.getElementById('overlay');

  function toggleMenu(open) {
    hamburger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    overlay?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
  overlay?.addEventListener('click', () => toggleMenu(false));
  document.querySelectorAll('.mobile-nav-links a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  // ── PWA SERVICE WORKER ──
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(r => console.log('[ERA] SW registered:', r.scope))
        .catch(e => console.warn('[ERA] SW failed:', e));
    });
  }

  // ── PWA INSTALL BANNER ──
  let deferredPrompt;
  const installBanner = document.getElementById('install-banner');
  const installBtn    = document.getElementById('install-btn');
  const installClose  = document.getElementById('install-close');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => { if (deferredPrompt) installBanner?.classList.add('show'); }, 3500);
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installBanner.classList.remove('show');
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  installClose?.addEventListener('click', () => {
    installBanner?.classList.remove('show');
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    installBanner?.classList.remove('show');
    deferredPrompt = null;
  });

});
