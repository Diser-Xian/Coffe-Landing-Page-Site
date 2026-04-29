// ============================================================
// admin.js — Brew & Co. Admin Panel Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminNav();
  initTheme();
});

function checkAdminAuth() {
  const loginScreen = document.getElementById('adminLogin');
  const dashboard = document.getElementById('adminDashboard');
  if (!loginScreen || !dashboard) return;

  if (isAdminLoggedIn()) {
    showDashboard();
  } else {
    showLoginScreen();
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const pw = document.getElementById('adminPassword').value;
      if (adminLogin(pw)) {
        showDashboard();
        showToast('Welcome back, Admin! ☕');
      } else {
        showToast('Incorrect password. Try admin123', 'error');
        document.getElementById('adminPassword').classList.add('shake');
        setTimeout(() => document.getElementById('adminPassword').classList.remove('shake'), 600);
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      adminLogout();
      showLoginScreen();
      showToast('Logged out successfully.', 'info');
    });
  }
}

function showDashboard() {
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
  loadAllAdminData();
  initTabNavigation();
}

function showLoginScreen() {
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

// ── Tab Navigation ────────────────────────────────────────
function initTabNavigation() {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  const panels = document.querySelectorAll('.admin-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
  if (tabs.length) tabs[0].click();
}

// ── Load All Data ─────────────────────────────────────────
function loadAllAdminData() {
  loadSettingsForm();
  renderEventsTable();
  renderProductsTable();
}

// ── Settings / Content Tab ────────────────────────────────
function loadSettingsForm() {
  const s = getSettings();
  const fields = ['heroHeadline', 'heroSubtitle', 'heroCta', 'aboutTitle', 'aboutText', 'footerText', 'mapEmbed', 'phone', 'email', 'address'];
  fields.forEach(key => {
    const el = document.getElementById(`set_${key}`);
    if (el) el.value = s[key] || '';
  });

  const form = document.getElementById('settingsForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const updated = {};
      fields.forEach(key => {
        const el = document.getElementById(`set_${key}`);
        if (el) updated[key] = el.value;
      });
      saveSettings(updated);
      showToast('Settings saved successfully! ✓');
    });
  }

  const resetBtn = document.getElementById('resetSettings');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all settings to defaults?')) {
        localStorage.removeItem('brew_settings');
        loadSettingsForm();
        showToast('Settings reset to defaults.', 'info');
      }
    });
  }
}

// ── Events Tab ────────────────────────────────────────────
function renderEventsTable() {
  const tbody = document.getElementById('eventsTableBody');
  if (!tbody) return;
  const events = getEvents();
  tbody.innerHTML = events.length === 0
    ? '<tr><td colspan="4" class="empty-row">No events yet.</td></tr>'
    : events.map(ev => `
      <tr>
        <td><strong>${ev.title}</strong></td>
        <td>${ev.date}</td>
        <td>${ev.time}</td>
        <td class="action-btns">
          <button class="btn-sm btn-edit" onclick="openEventModal(${ev.id})">Edit</button>
          <button class="btn-sm btn-delete" onclick="deleteEvent(${ev.id})">Delete</button>
        </td>
      </tr>`).join('');
}

function deleteEvent(id) {
  if (!confirm('Delete this event?')) return;
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
  renderEventsTable();
  showToast('Event deleted.');
}

function openEventModal(id = null) {
  const events = getEvents();
  const ev = id ? events.find(e => e.id === id) : null;
  const modal = document.getElementById('eventModal');
  const form = document.getElementById('eventForm');

  document.getElementById('eventModalTitle').textContent = ev ? 'Edit Event' : 'New Event';
  document.getElementById('ev_id').value = ev ? ev.id : '';
  document.getElementById('ev_title').value = ev ? ev.title : '';
  document.getElementById('ev_date').value = ev ? ev.date : '';
  document.getElementById('ev_time').value = ev ? ev.time : '';
  document.getElementById('ev_description').value = ev ? ev.description : '';
  document.getElementById('ev_image').value = ev ? ev.image : '';

  modal.classList.add('open');
}

function closeEventModal() {
  document.getElementById('eventModal').classList.remove('open');
}

function initEventModal() {
  const form = document.getElementById('eventForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('ev_id').value;
    const entry = {
      id: id ? parseInt(id) : generateId(),
      title: document.getElementById('ev_title').value.trim(),
      date: document.getElementById('ev_date').value,
      time: document.getElementById('ev_time').value.trim(),
      description: document.getElementById('ev_description').value.trim(),
      image: document.getElementById('ev_image').value.trim() || 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80'
    };
    if (!entry.title || !entry.date) {
      showToast('Title and date are required.', 'error');
      return;
    }
    const events = getEvents();
    if (id) {
      const idx = events.findIndex(e => e.id === parseInt(id));
      events[idx] = entry;
    } else {
      events.push(entry);
    }
    saveEvents(events);
    renderEventsTable();
    closeEventModal();
    showToast(id ? 'Event updated!' : 'Event added!');
  });

  document.getElementById('cancelEvent')?.addEventListener('click', closeEventModal);
  document.getElementById('eventModal')?.addEventListener('click', e => {
    if (e.target.id === 'eventModal') closeEventModal();
  });
}

// ── Products Tab ──────────────────────────────────────────
function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;
  const products = getProducts();
  tbody.innerHTML = products.length === 0
    ? '<tr><td colspan="4" class="empty-row">No products yet.</td></tr>'
    : products.map(p => `
      <tr>
        <td><img src="${p.image}" alt="${p.name}" class="product-thumb" onerror="this.style.display='none'"> <strong>${p.name}</strong></td>
        <td>${p.price}</td>
        <td class="desc-cell">${p.description.substring(0, 60)}...</td>
        <td class="action-btns">
          <button class="btn-sm btn-edit" onclick="openProductModal(${p.id})">Edit</button>
          <button class="btn-sm btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>`).join('');
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderProductsTable();
  showToast('Product deleted.');
}

function openProductModal(id = null) {
  const products = getProducts();
  const p = id ? products.find(pr => pr.id === id) : null;
  const modal = document.getElementById('productModal');

  document.getElementById('productModalTitle').textContent = p ? 'Edit Product' : 'New Product';
  document.getElementById('pr_id').value = p ? p.id : '';
  document.getElementById('pr_name').value = p ? p.name : '';
  document.getElementById('pr_price').value = p ? p.price : '';
  document.getElementById('pr_description').value = p ? p.description : '';
  document.getElementById('pr_image').value = p ? p.image : '';

  modal.classList.add('open');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
}

function initProductModal() {
  const form = document.getElementById('productForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('pr_id').value;
    const entry = {
      id: id ? parseInt(id) : generateId(),
      name: document.getElementById('pr_name').value.trim(),
      price: document.getElementById('pr_price').value.trim(),
      description: document.getElementById('pr_description').value.trim(),
      image: document.getElementById('pr_image').value.trim() || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'
    };
    if (!entry.name || !entry.price) {
      showToast('Name and price are required.', 'error');
      return;
    }
    const products = getProducts();
    if (id) {
      const idx = products.findIndex(p => p.id === parseInt(id));
      products[idx] = entry;
    } else {
      products.push(entry);
    }
    saveProducts(products);
    renderProductsTable();
    closeProductModal();
    showToast(id ? 'Product updated!' : 'Product added!');
  });

  document.getElementById('cancelProduct')?.addEventListener('click', closeProductModal);
  document.getElementById('productModal')?.addEventListener('click', e => {
    if (e.target.id === 'productModal') closeProductModal();
  });
}

// ── Admin Nav ─────────────────────────────────────────────
function initAdminNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // Init modals after DOM ready
  initEventModal();
  initProductModal();

  // Add event/product buttons
  document.getElementById('addEventBtn')?.addEventListener('click', () => openEventModal());
  document.getElementById('addProductBtn')?.addEventListener('click', () => openProductModal());
}

// Theme (shared)
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

// Shared toast
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> ${message}`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
