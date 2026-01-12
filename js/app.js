(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Footer year
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Email obfuscation
  const emailInline = $('#emailInline');
  if (emailInline) {
    const user = emailInline.dataset.user || 'hello';
    const domain = emailInline.dataset.domain || 'javascriptbuild.io';
    const addr = `${user}@${domain}`;
    const a = document.createElement('a');
    a.className = 'link';
    a.href = `mailto:${addr}`;
    a.textContent = addr;
    emailInline.appendChild(a);
  }

  // Mobile menu
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  const closeMenu = () => {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    $$('.nav__link', navLinks).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('is-open')) return;
      const inside = navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!inside) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Active nav highlight
  const sections = ['about', 'services', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navMap = new Map(
    $$('.nav__link')
      .filter(a => a.getAttribute('href')?.startsWith('#'))
      .map(a => [a.getAttribute('href').slice(1), a])
  );

  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navMap.forEach(a => a.classList.remove('is-active'));
          const a = navMap.get(entry.target.id);
          if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

    sections.forEach(s => io.observe(s));
  }

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-in');
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealIO.observe(el));

  // Scroll progress bar
  const progressBar = $('#progressBar');
  const updateProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const p = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = `${p}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Starfield background
  const canvas = $('#starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let stars = [];

    const resize = () => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
      stars = Array.from({ length: Math.max(60, Math.min(160, count)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.4 + 0.2) * dpr,
        vx: (Math.random() * 0.22 + 0.04) * dpr,
        vy: (Math.random() * 0.08 + 0.01) * dpr,
        a: Math.random() * 0.55 + 0.15
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x > w) s.x = 0;
        if (s.y > h) s.y = 0;

        ctx.beginPath();
        ctx.globalAlpha = s.a;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });
      requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(step);
  }
})();

// Scroll cue
const cue = document.querySelector('.scrollCue');
if (cue) {
  cue.addEventListener('click', () => {
    const targetSel = cue.getAttribute('data-target') || '#about';
    const target = document.querySelector(targetSel);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  updateCue();
  window.addEventListener('scroll', updateCue, { passive: true });
}
