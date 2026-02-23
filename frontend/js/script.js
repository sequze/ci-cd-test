/* ============================================
   CI/CD Page — Main JavaScript
   ============================================ */

'use strict';

/* ==========================================
   1. NAVBAR — scroll effect + burger menu
   ========================================== */
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when link is clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ==========================================
   2. SMOOTH ACTIVE NAV LINKS on scroll
   ========================================== */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ==========================================
   3. REVEAL ON SCROLL
   ========================================== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ==========================================
   4. COUNTER ANIMATION
   ========================================== */
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = !Number.isInteger(target);

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = ease * target;
    el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter, .stat-num').forEach(el => counterObserver.observe(el));

/* ==========================================
   5. PARTICLES in Hero
   ========================================== */
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 40;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'particle';

  const size = Math.random() * 3 + 1.5;
  const colors = ['#58a6ff', '#3fb950', '#bc8cff', '#f78616'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  p.style.cssText = `
    left: ${Math.random() * 100}%;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    animation-duration: ${8 + Math.random() * 12}s;
    animation-delay: ${Math.random() * 10}s;
    opacity: 0;
    border-radius: 50%;
  `;
  particlesContainer.appendChild(p);
}

/* ==========================================
   6. PIPELINE interactive
   ========================================== */
const steps    = document.querySelectorAll('.pipeline-step');
const infos    = document.querySelectorAll('.pipeline-info');
let activeStep = 0;
let playTimer  = null;
let isPlaying  = false;

function setStep(index) {
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i < index)  s.classList.add('done');
    if (i === index) s.classList.add('active');
  });
  infos.forEach((info, i) => {
    info.classList.toggle('active', i === index);
  });
  activeStep = index;
}

steps.forEach((step, i) => {
  step.addEventListener('click', () => {
    pausePipeline();
    setStep(i);
  });
});

function playPipeline() {
  if (isPlaying) return;
  isPlaying = true;
  playTimer = setInterval(() => {
    const next = (activeStep + 1) % steps.length;
    setStep(next);
  }, 1800);
}

function pausePipeline() {
  isPlaying = false;
  clearInterval(playTimer);
}

function resetPipeline() {
  pausePipeline();
  setStep(0);
}

document.getElementById('pipelinePlay').addEventListener('click', playPipeline);
document.getElementById('pipelinePause').addEventListener('click', pausePipeline);
document.getElementById('pipelineReset').addEventListener('click', resetPipeline);

// Auto-play when pipeline section is visible
const pipelineSection = document.getElementById('pipeline');
const pipelineAutoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => playPipeline(), 600);
    } else {
      pausePipeline();
    }
  });
}, { threshold: 0.4 });

pipelineAutoObserver.observe(pipelineSection);

/* ==========================================
   7. BACK TO TOP
   ========================================== */
const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   8. HERO STATS — inline counter (separate from section counters)
      They are triggered by the general counterObserver above.
   ========================================== */

/* ==========================================
   9. SMOOTH active link styles via CSS var
   ========================================== */
// Inject active style dynamically
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-links a.active { color: var(--accent-blue) !important; }
.nav-links a.active::after { transform: scaleX(1) !important; }`;
document.head.appendChild(styleEl);

/* ==========================================
   10. KEYBOARD NAVIGATION for pipeline
   ========================================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { pausePipeline(); setStep((activeStep + 1) % steps.length); }
  if (e.key === 'ArrowLeft')  { pausePipeline(); setStep((activeStep - 1 + steps.length) % steps.length); }
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    isPlaying ? pausePipeline() : playPipeline();
  }
});

/* ==========================================
   11. Card tilt effect on hover (subtle)
   ========================================== */
document.querySelectorAll('.tool-card, .info-card, .benefit-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ==========================================
   Console easter egg
   ========================================== */
console.log(
  '%c🚀 CI/CD Guide',
  'font-size:24px; font-weight:bold; color:#58a6ff;'
);
console.log(
  '%cАвтоматизируй всё. Релизь чаще. 💚',
  'font-size:14px; color:#3fb950;'
);

