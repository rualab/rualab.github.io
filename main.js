const landing        = document.getElementById('landing');
const landingScroll  = document.getElementById('landing-scroll');
const layout         = document.getElementById('layout');
const colLeft        = document.getElementById('col-left');
const colRight       = document.getElementById('col-right');
const menuOverlay    = document.getElementById('menu-overlay');
const menuTrigger    = document.getElementById('menu-trigger');
const menuClose      = document.getElementById('menu-close');
const logoHome       = document.getElementById('logo-home');
const progressFill   = document.getElementById('progress-fill');
const imagePanels    = document.querySelectorAll('.image-panel');
const projectEntries = document.querySelectorAll('.project-entry');
const entriesArr     = Array.from(projectEntries);

/* ── DETECCIÓN DE TOUCH / MÓVIL ───────────────────────── */
const isTouch = () => window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

/* ── GRAIN ────────────────────────────────────────────── */
const grain = document.createElement('div');
grain.className = 'grain-overlay';
document.body.appendChild(grain);

/* ── BLUR SINEWAVE (60s período) ──────────────────────── */
const BLUR_MIN = 5, BLUR_MAX = 10, BLUR_PERIOD = 60;
let blurRaf = null, blurPhase = 0, blurLastTs = null, blurActive = false;

function blurLoop(ts) {
  if (!blurLastTs) blurLastTs = ts;
  const dt = (ts - blurLastTs) / 1000;
  blurLastTs = ts;
  blurPhase += (dt / BLUR_PERIOD) * 2 * Math.PI;
  const t = (Math.sin(blurPhase - Math.PI / 2) + 1) / 2;
  const intensity  = BLUR_MIN + (BLUR_MAX - BLUR_MIN) * t;
  const brightness = (1 - intensity * 0.015).toFixed(3);
  document.querySelectorAll('.site-blur').forEach(el => {
    el.style.filter = `blur(${intensity.toFixed(2)}px) brightness(${brightness})`;
  });
  if (blurActive) blurRaf = requestAnimationFrame(blurLoop);
}

function startBlurLoop() {
  blurActive = true; blurLastTs = null; blurPhase = -Math.PI / 2;
  blurRaf = requestAnimationFrame(blurLoop);
}

function stopBlurLoop() {
  blurActive = false;
  cancelAnimationFrame(blurRaf);
  blurRaf = null; blurLastTs = null;
  document.querySelectorAll('.site-blur').forEach(el => {
    el.style.transition = 'filter 0.6s ease, transform 0.5s ease';
    el.style.filter = '';
    setTimeout(() => { el.style.transition = ''; }, 650);
  });
}

/* ── LANDING / SITE STATE ─────────────────────────────── */
let siteVisible = false;

function enterSite() {
  if (siteVisible) return;
  siteVisible = true;
  landing.classList.add('hidden');
  if (!isTouch()) layout.classList.add('visible');
  setTimeout(() => { if (window.shaderPause) window.shaderPause(); }, 900);
}

function returnToLanding() {
  siteVisible = false;
  layout.classList.remove('visible');
  landing.classList.remove('hidden');
  if (!isTouch()) colLeft.scrollTo({ top: 0, behavior: 'instant' });
  if (window.shaderResume) window.shaderResume();
}

landingScroll.addEventListener('click', enterSite);
landing.addEventListener('wheel', e => { if (e.deltaY > 0) enterSite(); });
landing.addEventListener('touchmove', () => enterSite(), { passive: true });

logoHome.addEventListener('click', e => {
  e.preventDefault();
  returnToLanding();
});

/* ── SCROLL AL TOP → REGRESA AL LANDING (solo desktop) ── */
let lastScrollTop = 0;
colLeft.addEventListener('scroll', () => {
  const st = colLeft.scrollTop;
  const max = colLeft.scrollHeight - colLeft.clientHeight;
  progressFill.style.height = max > 0 ? `${(st / max) * 100}%` : '0%';

  if (!isTouch() && st === 0 && lastScrollTop > 0 && siteVisible) {
    returnToLanding();
  }
  lastScrollTop = st;
}, { passive: true });

/* ── SCROLL DERECHA → IZQUIERDA (solo desktop) ────────── */
colRight.addEventListener('wheel', e => {
  if (isTouch()) return;
  e.preventDefault();
  colLeft.scrollBy({ top: e.deltaY });
}, { passive: false });

/* ── INTERSECTION OBSERVER — activa imagen + tarjeta ──── */
function activate(projectId) {
  imagePanels.forEach(p => p.classList.toggle('active', p.dataset.panel === projectId));
  projectEntries.forEach(e => e.classList.toggle('active', e.dataset.project === projectId));
}

// En móvil el root es null (viewport), en desktop es colLeft
function getObserverRoot() {
  return isTouch() ? null : colLeft;
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) activate(e.target.dataset.project); });
}, {
  root: getObserverRoot(),
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
});

projectEntries.forEach(e => observer.observe(e));
if (projectEntries[0]) activate(projectEntries[0].dataset.project);

/* ── MENÚ ─────────────────────────────────────────────── */
function openMenu() {
  menuOverlay.classList.add('open');
  document.body.classList.add('menu-open');
  if (!isTouch()) startBlurLoop();
}
function closeMenu() {
  menuOverlay.classList.remove('open');
  document.body.classList.remove('menu-open');
  stopBlurLoop();
}

menuTrigger.addEventListener('click', () => {
  menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
});
if (menuClose) menuClose.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

document.querySelectorAll('.menu-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    closeMenu();
    const id  = link.getAttribute('href').replace('#', '');
    const idx = entriesArr.findIndex(el => el.id === id || el.dataset.project === id);
    if (!siteVisible) enterSite();
    setTimeout(() => {
      if (idx >= 0) {
        entriesArr[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  });
});

/* ── CURSOR (solo desktop) ────────────────────────────── */
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

if (!isTouch()) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top  = `${e.clientY}px`;
    const leftEdge = colLeft.getBoundingClientRect().right;
    cursor.classList.toggle('expanded', siteVisible && e.clientX > leftEdge);
  });
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
} else {
  cursor.style.display = 'none';
}

/* ── TECLADO ↑↓ (solo desktop) ───────────────────────── */
document.addEventListener('keydown', e => {
  if (isTouch()) return;
  if (e.metaKey || e.ctrlKey) return;
  if (!siteVisible || menuOverlay.classList.contains('open')) return;
  const cur = entriesArr.findIndex(el => {
    const r = el.getBoundingClientRect();
    return r.top >= -10 && r.top < window.innerHeight / 2;
  });
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = cur >= 0 && cur < entriesArr.length - 1 ? entriesArr[cur + 1] : null;
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (cur <= 0) returnToLanding();
    else entriesArr[cur - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

/* ── PROYECTOS DATA ───────────────────────────────────── */
const PROJECTS = {
  'sight-sound': {
    title: 'SIGHT + SOUND',
    client: 'Festival International d\u2019art Num\u00e9rique \u2014 Eastern Bloc',
    year: '2024', location: 'Montr\u00e9al, Canad\u00e1',
    tags: ['Identidad Visual', 'Dise\u00f1o Generativo', 'Direcci\u00f3n de Arte', 'Front-end'],
    hero: 'img/a_sight-plus-sound.png', images: [],
    body: `<p>Identidad visual y sistema gr\u00e1fico para la 12\u00aa edici\u00f3n del festival.</p>`
  },
  'jazzuv-festival': {
    title: 'JazzUV 10\u00b0 Festival Internacional',
    client: 'Universidad Veracruzana', year: '2024', location: 'Xalapa, M\u00e9xico',
    tags: ['Identidad Visual', 'Ilustraci\u00f3n', 'Motion Graphics'],
    hero: 'img/b_festival-internacional-uv.png', images: [],
    body: `<p>Sistema de identidad para el d\u00e9cimo aniversario del festival de jazz de la UV.</p>`
  },
  'milieux': {
    title: 'Milieux Institute', client: 'Concordia University',
    year: '2020', location: 'Montr\u00e9al, Canad\u00e1',
    tags: ['Dise\u00f1o Editorial', 'Front-end', 'Visualizaci\u00f3n de Datos'],
    hero: 'img/c_milieux-2019-2020.png', images: [],
    body: `<p>Reporte anual 2019\u20132020. Concepto gr\u00e1fico inspirado en la Bauhaus.</p>`
  },
  'jazzuv-centro': {
    title: 'Centro de Estudios de Jazz',
    client: 'JazzUV, Universidad Veracruzana', year: '2024', location: 'Xalapa, M\u00e9xico',
    tags: ['Identidad Visual', 'Sistema Gr\u00e1fico'],
    hero: 'img/d_jazzuv-identidad.png', images: [],
    body: `<p>Sistema de identidad institucional para el Centro de Estudios de Jazz.</p>`
  },
  'moodlemoot': {
    title: 'MoodleMoot Costa Rica 2026',
    client: 'Emprove \u2014 Universidad Nacional', year: '2026', location: 'Costa Rica',
    tags: ['Identidad Visual', 'Dise\u00f1o Editorial', 'Web'],
    hero: 'img/e_moodlemoot-cr-2026.png', images: [],
    body: `<p>Identidad visual para el encuentro regional de la comunidad Moodle.</p>`
  },
};

/* ── CLICK EN TARJETA → PÁGINA ────────────────────────── */
projectEntries.forEach(entry => {
  entry.addEventListener('click', () => {
    if (!entry.classList.contains('active')) return;
    const urls = {
      'sight-sound':    'projects/sight-plus-sound.html',
      'jazzuv-festival':'projects/festival-internacional-jazz-24.html',
      'milieux':        'projects/milieux-annual-report-20.html',
      'jazzuv-centro':  'projects/centro-de-estudios-de-jazz.html',
      'moodlemoot':     'projects/moodlemoot-cr-26.html',
    };
    if (urls[entry.dataset.project]) window.location.href = urls[entry.dataset.project];
  });
});

/* ── SCROLL AL HASH DE LA URL AL CARGAR ───────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const target = document.querySelector(`.project-entry[data-project="${hash}"]`);
    if (target) {
      enterSite();
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 50);
    }
  }
});