// ============================================================
// main.js — Brew & Co. Landing Page Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  loadPageContent();
  initScrollAnimations();
  initSmoothScroll();
});

// ── Theme Toggle ──────────────────────────────────────────
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('brew_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  if (toggle) {
    toggle.innerHTML = saved === 'dark' ? '☀️' : '🌙';
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('brew_theme', next);
      toggle.innerHTML = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

// ── Navigation ────────────────────────────────────────────
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
  });
}

// ── Load Dynamic Content ─────────────────────────────────
function loadPageContent() {
  const settings = getSettings();
  const path = window.location.pathname;
  const isIndex = path.endsWith('index.html') || path === '/' || path.endsWith('/coffee-landing-page/');

  if (isIndex) {
    loadHero(settings);
    loadAbout(settings);
    loadProducts();
    loadTestimonials();
    loadFooter(settings);
  }
}

function loadHero(settings) {
  const headline = document.getElementById('heroHeadline');
  const subtitle = document.getElementById('heroSubtitle');
  const cta = document.getElementById('heroCta');
  if (headline) headline.innerHTML = settings.heroHeadline.replace(/\n/g, '<br>');
  if (subtitle) subtitle.textContent = settings.heroSubtitle;
  if (cta) cta.textContent = settings.heroCta;
}

function loadAbout(settings) {
  const title = document.getElementById('aboutTitle');
  const text = document.getElementById('aboutText');
  if (title) title.textContent = settings.aboutTitle;
  if (text) {
    text.innerHTML = settings.aboutText
      .split('\n\n')
      .map(p => `<p>${p}</p>`)
      .join('');
  }
}

function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const products = getProducts();
  grid.innerHTML = products.map(p => `
    <div class="card product-card reveal">
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'">
        <span class="price-badge">${p.price}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.description}</p>
      </div>
    </div>
  `).join('');
}

function loadTestimonials() {
  const wrap = document.getElementById('testimonialsWrap');
  if (!wrap) return;
  const testimonials = getTestimonials();
  wrap.innerHTML = testimonials.map(t => `
    <div class="testimonial-card reveal">
      <div class="stars">★★★★★</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.name.charAt(0)}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function loadFooter(settings) {
  const footerText = document.getElementById('footerText');
  const footerPhone = document.getElementById('footerPhone');
  const footerEmail = document.getElementById('footerEmail');
  const footerAddress = document.getElementById('footerAddress');
  if (footerText) footerText.textContent = settings.footerText;
  if (footerPhone) footerPhone.textContent = settings.phone;
  if (footerEmail) footerEmail.textContent = settings.email;
  if (footerAddress) footerAddress.textContent = settings.address;
}

// ── Scroll Animations ─────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Re-observe dynamically added elements
  const mutObs = new MutationObserver(() => {
    document.querySelectorAll('.reveal:not([data-observed])').forEach(el => {
      el.setAttribute('data-observed', '1');
      observer.observe(el);
    });
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}

// ── Smooth Scroll ─────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Toast Notifications ───────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9999;display:flex;flex-direction:column;gap:.75rem;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ── Events Page ───────────────────────────────────────────
function loadEventsPage() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const events = getEvents();
  if (events.length === 0) {
    grid.innerHTML = '<p class="empty-state">No upcoming events. Check back soon!</p>';
    return;
  }
  grid.innerHTML = events.map(ev => {
    const d = new Date(ev.date);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return `
    <div class="card event-card reveal">
      <div class="event-img-wrap">
        <img src="${ev.image}" alt="${ev.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80'">
        <div class="event-date-badge"><span class="ev-month">${month}</span><span class="ev-day">${day}</span></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${ev.title}</h3>
        <p class="event-time">🕐 ${ev.time}</p>
        <p class="card-desc">${ev.description}</p>
      </div>
    </div>`;
  }).join('');
}

// ── Contact Page ──────────────────────────────────────────
function loadContactPage() {
  const settings = getSettings();
  const map = document.getElementById('googleMap');
  const phone = document.getElementById('contactPhone');
  const email = document.getElementById('contactEmail');
  const address = document.getElementById('contactAddress');
  if (map) map.src = settings.mapEmbed;
  if (phone) phone.textContent = settings.phone;
  if (email) email.textContent = settings.email;
  if (address) address.textContent = settings.address;

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('#cName').value.trim();
      const email = form.querySelector('#cEmail').value.trim();
      const msg = form.querySelector('#cMessage').value.trim();
      if (!name || !email || !msg) {
        showToast('Please fill in all fields.', 'error');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        showToast('Please enter a valid email.', 'error');
        return;
      }

      // Send email using EmailJS
      emailjs.send('service_je44uxa', 'template_p57a5pb', {
        from_name: name,
        from_email: email,
        message: msg,
        to_name: 'Brew & Co.', // Optional: customize recipient name
      })
      .then(() => {
        showToast('Message sent! We\'ll be in touch soon. ☕', 'success');
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        showToast('Failed to send message. Please try again later.', 'error');
      });
    });
  }
}
