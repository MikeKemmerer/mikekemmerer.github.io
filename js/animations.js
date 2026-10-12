/* ═══════════════════════════════════════════════════════════════
   MIKE KEMMERER — PORTFOLIO BEHAVIOR
   Scroll reveals, progress bar, mobile nav, status bar
   No frameworks — vanilla JS
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progressBar = document.getElementById('scrollProgress');
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var sbPath = document.getElementById('sbPath');
  var sbPos = document.getElementById('sbPos');
  var sbPct = document.getElementById('sbPct');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[data-path]'));
  var navAnchors = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a')) : [];

  /* ── MOBILE NAV TOGGLE ── */
  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open').toString());
    });
    navAnchors.forEach(function (link) { link.addEventListener('click', closeNav); });
  }

  /* ── SCROLL REVEALS (once per element) ── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('active'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── SMOOTH SCROLL FOR ANCHORS ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── SCROLL-DRIVEN STATE ── */
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function currentSectionIndex() {
    var marker = window.innerHeight * 0.4;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= marker) idx = i;
    }
    return idx;
  }

  var lastIdx = -1;

  function update() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

    progressBar.style.width = pct + '%';
    nav.classList.toggle('scrolled', scrollTop > 60);

    if (sbPct) sbPct.textContent = Math.round(pct) + '%';

    if (!sections.length) return;
    var idx = currentSectionIndex();
    if (idx === lastIdx) return;
    lastIdx = idx;

    var section = sections[idx];
    if (sbPath) sbPath.textContent = section.getAttribute('data-path');
    if (sbPos) sbPos.textContent = pad(idx + 1) + '/' + pad(sections.length);

    var key = section.getAttribute('data-nav') || section.id;
    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + key);
    });
  }

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
