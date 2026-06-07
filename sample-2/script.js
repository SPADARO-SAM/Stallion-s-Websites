/* ── Scroll Progress Bar ── */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}

/* ── Sticky Nav ── */
const nav = document.querySelector('nav');
function updateNav() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}

/* ── Back to Top ── */
const backToTop = document.getElementById('back-to-top');
function updateBackToTop() {
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
  updateBackToTop();
}, { passive: true });


/* ── Hero Slideshow ── */
let current = 0;
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
let timer;

function goToSlide(n) {
  if (!slides.length) return;
  slides[current].classList.remove('active');
  dots[current]?.classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current]?.classList.add('active');
  clearInterval(timer);
  timer = setInterval(() => goToSlide(current + 1), 5500);
}

window.goToSlide = goToSlide;
window.changeSlide = (dir) => goToSlide(current + dir);

if (slides.length) {
  timer = setInterval(() => goToSlide(current + 1), 5500);
}

/* ── Scroll Reveal (Intersection Observer) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
  revealObserver.observe(el);
});

/* ── Animated Counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + suffix;
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

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── Testimonials Carousel ── */
let testiCurrent = 0;
const testiInner = document.querySelector('.testimonials-inner');
const testiDots  = document.querySelectorAll('.testi-dot');
const testiCount = testiDots.length;
let testiTimer;

function goToTesti(n) {
  if (!testiInner) return;
  testiCurrent = (n + testiCount) % testiCount;
  testiInner.style.transform = `translateX(-${testiCurrent * 100}%)`;
  testiDots.forEach((d, i) => d.classList.toggle('active', i === testiCurrent));
  clearInterval(testiTimer);
  testiTimer = setInterval(() => goToTesti(testiCurrent + 1), 6000);
}

window.goToTesti  = goToTesti;
window.changeTesti = (dir) => goToTesti(testiCurrent + dir);

if (testiInner) {
  testiTimer = setInterval(() => goToTesti(testiCurrent + 1), 6000);
}

/* ── Contact Form ── */
const form = document.getElementById('contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  const success = document.querySelector('.form-success');
  if (success) success.style.display = 'block';
});

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});
