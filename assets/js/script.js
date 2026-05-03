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
/* =============================================
   SUCCESS OVERLAY
   ============================================= */
function showSuccessOverlay() {
  const overlay = document.getElementById('formSuccess');
  if (!overlay) return;

  // Spawn rose-gold particles
  const colors = ['#b76e79','#e8a4aa','#f0c4c8','#c9848a','#fdf0f1'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'success-particle';
    const angle = (i / 18) * 360;
    const rad   = angle * (Math.PI / 180);
    const dist  = 60 + Math.random() * 80;
    p.style.cssText = `
      left:50%; top:50%;
      background:${colors[i % colors.length]};
      --tx:${Math.round(Math.cos(rad) * dist)}px;
      --ty:${Math.round(Math.sin(rad) * dist)}px;
      --dur:${(0.9 + Math.random() * 0.6).toFixed(2)}s;
      --delay:${(Math.random() * 0.3).toFixed(2)}s;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      width:${4 + Math.floor(Math.random() * 5)}px;
      height:${4 + Math.floor(Math.random() * 5)}px;
    `;
    overlay.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }

  overlay.classList.add('visible');
  setTimeout(() => {
    overlay.classList.add('hiding');
    setTimeout(() => {
      overlay.classList.remove('visible','hiding');
    }, 400);
  }, 4000);
}

/* =============================================
   CUSTOM FORM VALIDATION HELPERS
   ============================================= */
function showFieldError(input, message) {
  input.classList.add('invalid');
  let err = input.parentElement.querySelector('.field-error');
  if (err) err.remove();
  err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = message;
  input.parentElement.appendChild(err);
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
    const e = input.parentElement.querySelector('.field-error');
    if (e) e.remove();
  }, { once: true });
}

function validateForm(form) {
  let valid = true;
  const name    = form.querySelector('#name');
  const email   = form.querySelector('#email');
  const subject = form.querySelector('#subject');
  const message = form.querySelector('#message');

  if (!name.value.trim()) {
    showFieldError(name, 'Please enter your full name'); valid = false;
  }
  if (!email.value.trim()) {
    showFieldError(email, 'Please enter your email address'); valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showFieldError(email, 'Please enter a valid email address'); valid = false;
  }
  if (!subject.value.trim()) {
    showFieldError(subject, 'Please enter a subject'); valid = false;
  }
  if (!message.value.trim()) {
    showFieldError(message, 'Please write your message'); valid = false;
  }
  return valid;
}

/* =============================================
   CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(contactForm)) return;
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.innerHTML = '<ion-icon name="reload-outline"></ion-icon> Sending…';
    btn.disabled = true;
    btn.style.opacity = '0.8';

    try {
      const res = await fetch('https://formspree.io/f/mnjwjgbd', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (res.ok) {
        contactForm.reset();
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        showSuccessOverlay();
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.innerHTML = '<ion-icon name="alert-circle-outline"></ion-icon> Failed — try again';
      btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
      btn.style.opacity = '1';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
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
    const offset = (navbar ? navbar.offsetHeight : 70) + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
