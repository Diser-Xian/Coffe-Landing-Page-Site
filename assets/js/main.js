/* ══════════════════════════════════════════════════════
   BREW & CO. — MAIN JAVASCRIPT (FLUIDIZED VERSION)
   ══════════════════════════════════════════════════════ */

// ────────────────────────────────────────────────────────
// 0. SMALL UTILITIES (FLUID CORE)
// ────────────────────────────────────────────────────────

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => scope.querySelectorAll(sel);

// ────────────────────────────────────────────────────────
// 1. GLOBAL STATE & INIT
// ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initScrollObserver();
  loadHomePage();
});

// ────────────────────────────────────────────────────────
// 2. THEME
// ────────────────────────────────────────────────────────

function initTheme() {
  const themeToggle = $('#themeToggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme =
      document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeToggle = $('#themeToggle');
  if (!themeToggle) return;

  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  themeToggle.setAttribute(
    'aria-label',
    `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
  );
}

// ────────────────────────────────────────────────────────
// 3. NAVBAR (SMOOTHER + CLEANER)
// ────────────────────────────────────────────────────────

function initNavbar() {
  const navbar = $('.navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');

  let lastScroll = 0;

  window.addEventListener(
    'scroll',
    () => {
      const current = window.pageYOffset;

      navbar?.classList.toggle('scrolled', current > 50);
      lastScroll = current;
    },
    { passive: true }
  );

  if (!hamburger || !navLinks) return;

  const openMenu = () => {
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('active') ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ────────────────────────────────────────────────────────
// 4. SINGLE FLUID SCROLL OBSERVER (OPTIMIZED)
// ────────────────────────────────────────────────────────

let scrollObserver;

function initScrollObserver() {
  if (scrollObserver) return; // prevent duplicates

  scrollObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          scrollObserver.unobserve(entry.target); // smoother performance
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  observeReveals();
}

function observeReveals() {
  $$('.reveal').forEach(el => scrollObserver.observe(el));
}

// ────────────────────────────────────────────────────────
// 5. HOME PAGE
// ────────────────────────────────────────────────────────

function loadHomePage() {
  loadHeroContent();
  loadAboutContent();
  loadProducts();
  loadTestimonials();
  loadFooterContent();
}

// ────────────────────────────────────────────────────────
// 6. CONTENT LOADERS (FLUIDIFIED DOM HANDLING)
// ────────────────────────────────────────────────────────

function loadHeroContent() {
  const s = getSettings();

  const headline = $('#heroHeadline');
  const subtitle = $('#heroSubtitle');
  const cta = $('#heroCta');

  if (headline && s.heroHeadline) {
    const parts = s.heroHeadline.split(/(<em>.*?<\/em>)/);
    headline.innerHTML = parts
      .map(p => (p.startsWith('<em>') ? p : p.replace(/\n/g, '<br>')))
      .join('');
  }

  if (subtitle) subtitle.textContent = s.heroSubtitle;
  if (cta) cta.textContent = s.heroCta;
}

function loadAboutContent() {
  const s = getSettings();

  const title = $('#aboutTitle');
  const text = $('#aboutText');

  if (title) title.textContent = s.aboutTitle;

  if (text) {
    text.innerHTML = s.aboutText
      .split(/\n\n+/)
      .filter(Boolean)
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  }
}

function loadProducts() {
  const grid = $('#productsGrid');
  if (!grid) return;

  const products = getProducts();

  grid.innerHTML = products.length
    ? products
        .map(
          p => `
      <div class="product-card reveal">
        ${
          p.image
            ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(
                p.name
              )}" class="product-img" loading="lazy">`
            : '<div class="product-img"></div>'
        }
        <div class="product-info">
          <div class="product-header">
            <h3 class="product-name">${escapeHtml(p.name)}</h3>
            <span class="product-price">${escapeHtml(p.price)}</span>
          </div>
          ${
            p.description
              ? `<p class="product-description">${escapeHtml(
                  p.description
                )}</p>`
              : ''
          }
        </div>
      </div>
    `
        )
        .join('')
    : `<p style="text-align:center; grid-column:1/-1; color:var(--text-muted)">No products yet</p>`;

  observeReveals();
}

function loadTestimonials() {
  const wrap = $('#testimonialsWrap');
  if (!wrap) return;

  const data = [
    { quote: 'Best coffee!', name: 'Sarah M.', role: 'Customer' },
    { quote: 'Amazing place.', name: 'James K.', role: 'Enthusiast' },
    { quote: 'Perfect vibe.', name: 'Emily R.', role: 'Designer' }
  ];

  wrap.innerHTML = data
    .map(
      t => `
    <div class="testimonial-card reveal">
      <p class="testimonial-quote">"${escapeHtml(t.quote)}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.name[0]}</div>
        <div>
          <div class="testimonial-name">${escapeHtml(t.name)}</div>
          <div class="testimonial-role">${escapeHtml(t.role)}</div>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  observeReveals();
}

function loadFooterContent() {
  const s = getSettings();

  const map = {
    '#footerAddress': s.address,
    '#footerPhone': s.phone,
    '#footerEmail': s.email
  };

  Object.entries(map).forEach(([sel, val]) => {
    $$(sel).forEach(el => (el.textContent = val));
  });
}

// ────────────────────────────────────────────────────────
// 7. CONTACT (EMAIL FIX KEPT + FLUID UX)
// ────────────────────────────────────────────────────────

function loadContactPage() {
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', handleContactSubmit);

  initLazyMap();
}

function initLazyMap() {
  const mapFrame = document.getElementById('googleMap');
  if (!mapFrame || !mapFrame.dataset.src) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mapFrame.src = mapFrame.dataset.src;
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px 0px' });

    observer.observe(mapFrame);
  } else {
    mapFrame.src = mapFrame.dataset.src;
  }
}

function initScrollAnimations() {
  initScrollObserver();
}

// EMAIL SYSTEM (UNCHANGED LOGIC, CLEANER FLOW)
function handleContactSubmit(e) {
  e.preventDefault();

  const name = $('#cName').value;
  const email = $('#cEmail').value;
  const message = $('#cMessage').value;

  if (typeof emailjs === 'undefined') {
    showToast('Email service not loaded.', 'error');
    return;
  }

  if (!window.__emailjs_initialized) {
    emailjs.init(
      localStorage.getItem('emailjs_public_key') || 'YOUR_PUBLIC_KEY'
    );
    window.__emailjs_initialized = true;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  emailjs
    .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      from_name: name,
      from_email: email,
      message
    })
    .then(() => {
      showToast('Message sent successfully!', 'success');
      e.target.reset();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to send message.', 'error');
    })
    .finally(() => {
      btn.textContent = original;
      btn.disabled = false;
    });
}

// ────────────────────────────────────────────────────────
// 8. TOAST (LIGHTWEIGHT FLUID VERSION)
// ────────────────────────────────────────────────────────

function showToast(msg, type = 'success') {
  let box = $('.toast-container');

  if (!box) {
    box = document.createElement('div');
    box.className = 'toast-container';
    document.body.appendChild(box);
  }

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;

  box.appendChild(el);

  setTimeout(() => el.remove(), 3500);
}

// ────────────────────────────────────────────────────────
// 9. UTIL
// ────────────────────────────────────────────────────────

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}