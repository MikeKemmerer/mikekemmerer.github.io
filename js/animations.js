/* ═══════════════════════════════════════════════════════════════
   MIKE KEMMERER — PORTFOLIO ANIMATIONS
   Scroll reveals, progress bar, mobile nav, parallax
   No frameworks — vanilla IntersectionObserver
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  /* ── NAV SCROLL STATE ── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ── INTERSECTION OBSERVER — Scroll Reveals ── */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // If reduced motion, reveal everything immediately
  if (prefersReducedMotion) {
    document.querySelectorAll(revealSelectors).forEach(function (el) {
      el.classList.add('active');
    });
  } else {
    document.querySelectorAll(revealSelectors).forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ── SMOOTH SCROLL FOR NAV LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80; // nav height
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── PARALLAX ON HERO ── */
  var heroContent = document.querySelector('.hero-content');

  function updateParallax() {
    if (prefersReducedMotion || !heroContent) return;
    var scroll = window.scrollY;
    var vh = window.innerHeight;
    if (scroll < vh) {
      var factor = scroll / vh;
      heroContent.style.transform = 'translateY(' + (scroll * 0.3) + 'px)';
      heroContent.style.opacity = 1 - factor * 0.8;
    }
  }

  /* ── THROTTLED SCROLL HANDLER ── */
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateProgress();
        updateNav();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateProgress();
  updateNav();

})();
