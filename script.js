/* ============================================
   SPLASH SCREEN
   ============================================ */
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => splash.remove(), 750);
  }, 2200);
});


/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;

// Dot tracks cursor exactly
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Ring follows with smooth lag
(function animateRing() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Hover expand on interactive elements
const hoverTargets = 'a, button, .pricing-card, .service-card, .work-card, input, select, textarea';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Click shrink pulse
document.addEventListener('mousedown', () => document.body.classList.add('cursor-clicked'));
document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-clicked'));

// Hide when cursor leaves window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});


/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function animateCounter(el) {
  const original = el.textContent.trim();

  // Handle range format "3–7"
  if (original.includes('–')) {
    const parts  = original.split('–');
    const endA   = parseInt(parts[0]);
    const endB   = parseInt(parts[1]);
    const suffix = '';
    runCount(el, 0, endA, 2000, (n) => `${n}–${endB}`);
    return;
  }

  // Handle "50+" or "100%"
  const match = original.match(/^(\d+)(.*)$/);
  if (!match) return;
  const end    = parseInt(match[1]);
  const suffix = match[2];
  runCount(el, 0, end, 2000, (n) => `${n}${suffix}`);
}

function runCount(el, from, to, duration, formatter) {
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // Ease out expo
    const eased  = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(from + (to - from) * eased);
    el.textContent = formatter(current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));


/* ============================================
   NAV SCROLL EFFECT
   ============================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});


/* ============================================
   MOBILE HAMBURGER
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  if (!open) {
    Object.assign(navLinks.style, {
      position:        'absolute',
      top:             '100%',
      left:            '0',
      right:           '0',
      flexDirection:   'column',
      gap:             '0',
      background:      'rgba(8,8,8,0.97)',
      backdropFilter:  'blur(20px)',
      border:          '1px solid rgba(255,255,255,0.08)',
      borderTop:       'none',
      padding:         '12px 24px 20px',
      alignItems:      'flex-start',
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.style.padding = '10px 0';
      a.style.display = 'block';
    });
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { navLinks.style.display = 'none'; });
});


/* ============================================
   SCROLL REVEAL
   ============================================ */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));


/* ============================================
   CONTACT FORM SUBMIT
   ============================================ */
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent  = 'Message Sent ✓';
  btn.style.background = '#1a1a1a';
  btn.style.color      = '#fff';
  btn.style.border     = '1px solid rgba(255,255,255,0.2)';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style = '';
    btn.disabled = false;
    this.reset();
  }, 3500);
});


/* ============================================
   SMOOTH SCROLL (offset for fixed nav)
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
