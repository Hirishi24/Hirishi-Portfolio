'use strict';

/* =============================================
   THEME TOGGLE — light / dark
   ============================================= */
(function () {
  const root    = document.documentElement;
  const btn     = document.getElementById('themeToggle');
  const saved   = localStorage.getItem('theme');
  const prefers = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initial = saved || prefers;

  if (initial === 'light') root.setAttribute('data-theme', 'light');

  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }
})();

/* =============================================
   NAVBAR — scroll behaviour + mobile drawer
   ============================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* =============================================
   ACTIVE NAV — based on scroll position
   ============================================= */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* =============================================
   TYPED TEXT EFFECT
   ============================================= */
const roles = ['AI/ML Engineer', 'Edge Computing Researcher', 'Web Developer', 'IoT Enthusiast', 'Future Entrepreneur'];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
  const target = document.getElementById('typedText');
  if (!target) return;

  const current = roles[roleIndex];
  if (!isDeleting) {
    target.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    target.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 55 : 90);
}

typeLoop();

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }, { passive: true });
}

/* =============================================
   HERO PARALLAX — shapes drift on scroll
   ============================================= */
const heroShapes = document.querySelectorAll('.shape');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  heroShapes.forEach((s, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    s.style.transform = `translateY(${y * 0.12 * dir}px)`;
  });
}, { passive: true });

/* =============================================
   REVEAL ON SCROLL — all directions
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
  .forEach(el => revealObserver.observe(el));

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* =============================================
   CARD 3D TILT ON MOUSE MOVE
   ============================================= */
function addTilt(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

addTilt('.skill-card', 6);
addTilt('.svc-card', 5);
addTilt('.hero-badge', 10);

/* =============================================
   SKILL BARS
   ============================================= */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-fill').forEach(el => skillObserver.observe(el));

/* =============================================
   TIMELINE TABS
   ============================================= */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('[data-tab-content]').forEach(panel => {
      panel.classList.toggle('hidden', panel.dataset.tabContent !== tab);
    });

    document.querySelectorAll(`#${tab} .reveal`).forEach(el => {
      el.classList.remove('visible');
      revealObserver.observe(el);
    });
  });
});

/* =============================================
   BACK TO TOP
   ============================================= */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight : 70;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
