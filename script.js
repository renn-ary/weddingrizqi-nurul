/* ===== WEDDING INVITATION - script.js ===== */

const WEDDING_DATE = new Date('2026-09-19T10:00:00');
const WEDDING_LOCATION = 'Sugihwaras, Jombang Regency, East Java';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=9774%2B9C2+Sugihwaras,+Jombang+Regency,+East+Java';

const SECTION_IDS = [
  'section-opening',
  'section-countdown',
  'section-doa',
  'section-mempelai',
  'section-acara',
  'section-gift',
  'section-gallery',
  'section-penutup',
];

// ===== STATE =====
let isCoverOpen = false;
let isMusicPlaying = false;
let musicEnabled = false;
let activeSection = 0;
let scrollHideNavTimeout = null;
let musicScrollTimeout = null;
let countdownInterval = null;
let scrollObserver = null;

// ===== GUEST NAME =====
function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  if (to) {
    document.getElementById('guest-name').textContent = decodeURIComponent(to.replace(/\+/g, ' '));
  }
}

// ===== SPARKLES =====
function createSparkles(host, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    const size = Math.random() * 4 + 2;
    el.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      width:${size}px;
      height:${size}px;
      animation-delay:${Math.random() * 2}s;
    `;
    host.appendChild(el);
  }
}

function initAllSparkles() {
  // Cover sparkles
  createSparkles(document.getElementById('cover-sparkles'), 30);
  // Section sparkles
  document.querySelectorAll('.sparkles-host[data-count]').forEach(host => {
    createSparkles(host, parseInt(host.dataset.count, 10));
  });
}

// ===== PENUTUP STARS =====
function initPenutupStars() {
  const container = document.getElementById('penutup-stars');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'penutup-star-dot';
    const dur = (2 + Math.random() * 3).toFixed(2);
    const delay = (Math.random() * 3).toFixed(2);
    el.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${dur}s;--delay:${delay}s;`;
    container.appendChild(el);
  }
}

// ===== COUNTDOWN =====
function calcCountdown() {
  const now = Date.now();
  const distance = WEDDING_DATE.getTime() - now;
  if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    finished: false,
  };
}

function updateCountdownUI(cd) {
  const grid = document.getElementById('countdown-grid');
  const finished = document.getElementById('countdown-finished');
  if (cd.finished) {
    grid.style.display = 'none';
    finished.style.display = 'block';
    return;
  }
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent = pad(cd.days);
  document.getElementById('cd-hours').textContent = pad(cd.hours);
  document.getElementById('cd-minutes').textContent = pad(cd.minutes);
  document.getElementById('cd-seconds').textContent = pad(cd.seconds);
}

function initCountdown() {
  updateCountdownUI(calcCountdown());
  countdownInterval = setInterval(() => updateCountdownUI(calcCountdown()), 1000);
}

// ===== MUSIC PLAYER =====
function initMusic() {
  const player = document.getElementById('music-player');
  const audio = document.getElementById('audio');
  if (!audio) return;

  // visibility change pause/resume
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.pause();
      isMusicPlaying = false;
      syncMusicUI();
    } else if (isCoverOpen) {
      const saved = localStorage.getItem('musicStatus');
      if (saved !== 'paused') {
        audio.play().catch(() => {});
        isMusicPlaying = true;
        syncMusicUI();
      }
    }
  });
}

function syncMusicUI() {
  const player = document.getElementById('music-player');
  const iconPlay = document.getElementById('music-icon-play');
  const iconPause = document.getElementById('music-icon-pause');
  if (isMusicPlaying) {
    player.classList.add('playing');
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  } else {
    player.classList.remove('playing');
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  }
}

function toggleMusic() {
  const audio = document.getElementById('audio');
  if (!audio) return;
  isMusicPlaying = !isMusicPlaying;
  localStorage.setItem('musicStatus', isMusicPlaying ? 'playing' : 'paused');
  if (isMusicPlaying) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
  syncMusicUI();
}

// ===== OPEN INVITATION =====
function openInvitation() {
  const cover = document.getElementById('cover-page');
  const main = document.getElementById('main-content');
  const musicPlayer = document.getElementById('music-player');
  const navDots = document.getElementById('nav-dots');

  cover.classList.add('sliding-up');
  cover.addEventListener('animationend', () => {
    cover.style.display = 'none';
    main.style.display = 'block';
    musicPlayer.style.display = 'flex';
    navDots.style.display = 'flex';

    // Enable scrolling
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.msOverflowStyle = 'none';
    document.body.style.scrollbarWidth = 'none';

    isCoverOpen = true;

    // Music
    const saved = localStorage.getItem('musicStatus');
    musicEnabled = true;
    if (saved !== 'paused') {
      const audio = document.getElementById('audio');
      audio.play().catch(() => {});
      isMusicPlaying = true;
    }
    syncMusicUI();

    // Scroll to top
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 50);

    initNavDots();
    initScrollTracking();
    initScrollAnimations();
  }, { once: true });
}

// ===== NAVIGATION DOTS =====
function initNavDots() {
  const container = document.getElementById('nav-dots');
  container.innerHTML = ''; // Clear any existing dots to prevent duplicates
  SECTION_IDS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Halaman ${i + 1}`);
    dot.dataset.index = i;
    container.appendChild(dot);
  });

  // Single event delegation handler — works for both click and touch
  function handleDotTap(e) {
    const dot = e.target.closest('.nav-dot');
    if (!dot) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const index = parseInt(dot.dataset.index, 10);
    if (!isNaN(index)) smoothScrollTo(index);
  }

  // Click handler in capture phase — fires BEFORE the click guard
  container.addEventListener('click', handleDotTap, true);

  // Touch handler for mobile — fires immediately, no 300ms delay
  container.addEventListener('touchend', (e) => {
    const dot = e.target.closest('.nav-dot');
    if (!dot) return;
    e.preventDefault(); // Prevent ghost click
    const index = parseInt(dot.dataset.index, 10);
    if (!isNaN(index)) smoothScrollTo(index);
  }, { passive: false });
}

function updateNavDots(current) {
  const dots = document.querySelectorAll('.nav-dot');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
}

// ===== SMOOTH SCROLL =====
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(sectionIndex) {
  const id = SECTION_IDS[sectionIndex];
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const startPos = window.pageYOffset || 0;
  const targetPos = el.getBoundingClientRect().top + startPos - 8;
  const distance = targetPos - startPos;
  const duration = 800;
  let start = null;
  const step = (currentTime) => {
    if (start === null) start = currentTime;
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startPos + distance * easeInOutCubic(progress));
    if (elapsed < duration) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ===== SCROLL TRACKING =====
function initScrollTracking() {
  const musicPlayer = document.getElementById('music-player');
  const navDots = document.getElementById('nav-dots');

  window.addEventListener('scroll', () => {
    // Hide music player while scrolling
    musicPlayer.classList.add('scrolling');
    clearTimeout(musicScrollTimeout);
    musicScrollTimeout = setTimeout(() => musicPlayer.classList.remove('scrolling'), 1000);

    // Visually fade nav dots briefly during scroll (no pointer-events block)
    navDots.classList.add('scrolling');
    clearTimeout(scrollHideNavTimeout);
    scrollHideNavTimeout = setTimeout(() => navDots.classList.remove('scrolling'), 150);

    // Update active section
    let current = 0;
    for (let i = 0; i < SECTION_IDS.length; i++) {
      const el = document.getElementById(SECTION_IDS[i]);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5) current = i;
    }
    if (current !== activeSection) {
      activeSection = current;
      updateNavDots(current);
    }
  }, { passive: true });

  // Run once immediately
  requestAnimationFrame(() => {
    const evt = new Event('scroll');
    window.dispatchEvent(evt);
  });
}

// ===== SCROLL ANIMATIONS (IntersectionObserver) =====
function initScrollAnimations() {
  const els = document.querySelectorAll('.scroll-animate');
  let lastScrollTop = window.pageYOffset || 0;

  els.forEach(el => {
    if (!el.classList.contains('fade-up') && !el.classList.contains('fade-down')) {
      el.classList.add('fade-up');
    }
  });

  scrollObserver = new IntersectionObserver((entries) => {
    const currentScrollTop = window.pageYOffset || 0;
    const scrollingDown = currentScrollTop >= lastScrollTop;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (scrollingDown) {
          entry.target.classList.remove('fade-down');
          entry.target.classList.add('fade-up');
        } else {
          entry.target.classList.remove('fade-up');
          entry.target.classList.add('fade-down');
        }
        void entry.target.offsetWidth;
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
    lastScrollTop = Math.max(0, currentScrollTop);
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => scrollObserver.observe(el));

  // Immediately show visible elements
  requestAnimationFrame(() => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  });
}

// ===== GALLERY ZOOM =====
function toggleZoom(el) {
  el.classList.toggle('zoomed');
}

// ===== COPY NUMBER =====
function copyNumber(number) {
  navigator.clipboard.writeText(number).then(() => {
    showToast();
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = number;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); showToast(); } catch(e) {}
    document.body.removeChild(ta);
  });
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'flex';
  toast.style.animation = 'none';
  void toast.offsetWidth; // reflow
  toast.style.animation = 'toastIn 0.4s cubic-bezier(0.17,0.89,0.32,1.27) both';
  setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

// ===== MAPS =====
function openMaps() {
  window.open(MAPS_URL, '_blank');
}

function shareLocation() {
  if (navigator.share) {
    navigator.share({
      title: 'Lokasi Pernikahan Rizqi & Nurul',
      text: `Undangan Pernikahan - Lokasi: ${WEDDING_LOCATION}`,
      url: MAPS_URL,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(MAPS_URL).then(() => {
      alert('Link Google Maps berhasil disalin!');
    });
  }
}

// ===== CLICK GUARD (prevent accidental scrolls being clicks) =====
function initClickGuard() {
  const INTERACTIVE = 'button, a, input, select, textarea, label, [role="button"], .nav-dot, .music-player, .btn-primary, .btn-gift, .gallery-image, .bank-card, .gallery-img';
  const isInteractive = (el) => el && ((el.matches && el.matches(INTERACTIVE)) || (el.closest && el.closest(INTERACTIVE)));
  document.addEventListener('click', (e) => {
    if (!isInteractive(e.target)) e.stopPropagation();
  }, true);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initAllSparkles();
  initPenutupStars();
  initCountdown();
  // initNavDots() is called in openInvitation() — not here, to prevent duplicate dots
  initMusic();
  initClickGuard();
});
