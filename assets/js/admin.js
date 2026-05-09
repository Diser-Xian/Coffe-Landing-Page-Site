// ============================================================
// admin.js — Brew & Co. Admin Panel (Refactored Pro Version)
// ============================================================

(() => {
  'use strict';

  // ─────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => scope.querySelectorAll(selector);

  const escapeHTML = (str = '') =>
    str.replace(/[&<>"']/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[tag]));

  const generateId = () => Date.now();

  // ─────────────────────────────────────────────
  // Init
  // ─────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    checkAdminAuth();
    initAdminNav();
    initTheme();
    initGlobalUX();
  }

  // ─────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────

  function checkAdminAuth() {
    const loginScreen = $('#adminLogin');
    const dashboard = $('#adminDashboard');

    if (!loginScreen || !dashboard) return;

    if (isAdminLoggedIn()) {
      showDashboard();
    } else {
      showLoginScreen();
    }

    const loginForm = $('#loginForm');
    if (loginForm) {
      loginForm.onsubmit = e => {
        e.preventDefault();

        const pwInput = $('#adminPassword');
        const pw = pwInput.value.trim();

        if (adminLogin(pw)) {
          showDashboard();
          showToast('Welcome back, Admin! ☕');
        } else {
          showToast('Incorrect password.', 'error');
          pwInput.classList.add('shake');
          setTimeout(() => pwInput.classList.remove('shake'), 600);
        }
      };
    }

    $('#logoutBtn')?.addEventListener('click', () => {
      adminLogout();
      showLoginScreen();
      showToast('Logged out successfully.', 'info');
    });
  }

  function showDashboard() {
    $('#adminLogin').style.display = 'none';
    $('#adminDashboard').style.display = 'flex';
    loadAllAdminData();
    initTabNavigation();
  }

  function showLoginScreen() {
    $('#adminLogin').style.display = 'flex';
    $('#adminDashboard').style.display = 'none';
  }

  // ─────────────────────────────────────────────
  // Tabs
  // ─────────────────────────────────────────────

  function initTabNavigation() {
    const tabs = $$('.admin-tab-btn');
    const panels = $$('.admin-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');

        const target = document.getElementById(tab.dataset.tab);
        target?.classList.add('active');
      });
    });

    tabs[0]?.click();
  }

  // ─────────────────────────────────────────────
  // Data Loader
  // ─────────────────────────────────────────────

  function loadAllAdminData() {
    loadSettingsForm();
    renderEventsTable();
    renderProductsTable();
    initEventModal();
    initProductModal();
  }

  // ─────────────────────────────────────────────
  // Settings
  // ─────────────────────────────────────────────

  function loadSettingsForm() {
    const s = getSettings();
    const fields = [
      'heroHeadline', 'heroSubtitle', 'heroCta',
      'aboutTitle', 'aboutText', 'footerText',
      'mapEmbed', 'phone', 'email', 'address'
    ];

    fields.forEach(key => {
      const el = $(`#set_${key}`);
      if (el) el.value = s[key] || '';
    });

    const form = $('#settingsForm');
    if (form) {
      form.onsubmit = e => {
        e.preventDefault();

        const updated = {};
        fields.forEach(key => {
          const el = $(`#set_${key}`);
          if (el) updated[key] = el.value;
        });

        saveSettings(updated);
        showToast('Settings saved successfully!');
      };
    }

    $('#resetSettings')?.addEventListener('click', () => {
      if (confirm('Reset all settings?')) {
        localStorage.removeItem('brew_settings');
        loadSettingsForm();
        showToast('Settings reset.', 'info');
      }
    });
  }

  // ─────────────────────────────────────────────
  // Events
  // ─────────────────────────────────────────────

  function renderEventsTable() {
    const tbody = $('#eventsTableBody');
    if (!tbody) return;

    const events = getEvents();

    tbody.innerHTML = events.length === 0
      ? `<tr><td colspan="4">No events yet.</td></tr>`
      : events.map(ev => `
        <tr>
          <td><strong>${escapeHTML(ev.title)}</strong></td>
          <td>${escapeHTML(ev.date)}</td>
          <td>${escapeHTML(ev.time)}</td>
          <td>
            <button data-id="${ev.id}" class="edit-event">Edit</button>
            <button data-id="${ev.id}" class="delete-event">Delete</button>
          </td>
        </tr>
      `).join('');
  }

  function initEventModal() {
    const form = $('#eventForm');
    if (!form) return;

    form.onsubmit = e => {
      e.preventDefault();

      const id = $('#ev_id').value;
      const entry = {
        id: id ? parseInt(id) : generateId(),
        title: $('#ev_title').value.trim(),
        date: $('#ev_date').value,
        time: $('#ev_time').value.trim(),
        description: $('#ev_description').value.trim(),
        image: $('#ev_image').value.trim()
      };

      if (!entry.title || !entry.date) {
        showToast('Title & date required.', 'error');
        return;
      }

      const events = getEvents();

      if (id) {
        const idx = events.findIndex(e => e.id === parseInt(id));
        if (idx !== -1) events[idx] = entry;
      } else {
        events.push(entry);
      }

      saveEvents(events);
      renderEventsTable();
      closeEventModal();
    };

    $('#eventsTableBody')?.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);

      if (e.target.classList.contains('edit-event')) {
        openEventModal(id);
      }

      if (e.target.classList.contains('delete-event')) {
        deleteEvent(id);
      }
    });
  }

  function openEventModal(id = null) {
    const modal = $('#eventModal');
    if (!modal) return;

    const ev = getEvents().find(e => e.id === id);

    $('#ev_id').value = ev?.id || '';
    $('#ev_title').value = ev?.title || '';
    $('#ev_date').value = ev?.date || '';
    $('#ev_time').value = ev?.time || '';
    $('#ev_description').value = ev?.description || '';
    $('#ev_image').value = ev?.image || '';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeEventModal() {
    const modal = $('#eventModal');
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
  }

  function deleteEvent(id) {
    if (!confirm('Delete event?')) return;
    saveEvents(getEvents().filter(e => e.id !== id));
    renderEventsTable();
  }

  // ─────────────────────────────────────────────
  // Products (same improvements)
  // ─────────────────────────────────────────────

  function renderProductsTable() {
    const tbody = $('#productsTableBody');
    if (!tbody) return;

    const products = getProducts();

    tbody.innerHTML = products.length === 0
      ? `<tr><td colspan="4">No products yet.</td></tr>`
      : products.map(p => `
        <tr>
          <td><strong>${escapeHTML(p.name)}</strong></td>
          <td>${escapeHTML(p.price)}</td>
          <td>${escapeHTML(p.description)}</td>
          <td>
            <button data-id="${p.id}" class="edit-product">Edit</button>
            <button data-id="${p.id}" class="delete-product">Delete</button>
          </td>
        </tr>
      `).join('');
  }

  function initProductModal() {
    const form = $('#productForm');
    if (!form) return;

    form.onsubmit = e => {
      e.preventDefault();

      const id = $('#pr_id').value;

      const entry = {
        id: id ? parseInt(id) : generateId(),
        name: $('#pr_name').value.trim(),
        price: $('#pr_price').value.trim(),
        description: $('#pr_description').value.trim(),
        image: $('#pr_image').value.trim()
      };

      if (!entry.name || !entry.price) {
        showToast('Name & price required.', 'error');
        return;
      }

      const products = getProducts();

      if (id) {
        const idx = products.findIndex(p => p.id === parseInt(id));
        if (idx !== -1) products[idx] = entry;
      } else {
        products.push(entry);
      }

      saveProducts(products);
      renderProductsTable();
      closeProductModal();
    };
  }

  function closeProductModal() {
    $('#productModal')?.classList.remove('open');
  }

  // ─────────────────────────────────────────────
  // Navbar UX
  // ─────────────────────────────────────────────

  function initAdminNav() {
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');

    hamburger?.addEventListener('click', () => {
      navLinks?.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    document.addEventListener('click', e => {
      if (!navLinks?.contains(e.target) && !hamburger?.contains(e.target)) {
        navLinks?.classList.remove('open');
        hamburger?.classList.remove('active');
      }
    });
  }

  // ─────────────────────────────────────────────
  // Accessibility + UX
  // ─────────────────────────────────────────────

  function initGlobalUX() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeEventModal();
        closeProductModal();
      }
    });
  }

  // ─────────────────────────────────────────────
  // Theme
  // ─────────────────────────────────────────────

  function initTheme() {
    const toggle = $('#themeToggle');
    const saved = localStorage.getItem('brew_theme') || 'dark';

    document.documentElement.setAttribute('data-theme', saved);

    if (toggle) {
      toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

      toggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('brew_theme', next);
        toggle.textContent = next === 'dark' ? '☀️' : '🌙';
      });
    }
  }

  // ─────────────────────────────────────────────
  // Toast
  // ─────────────────────────────────────────────

  function showToast(message, type = 'success') {
    let container = $('#toastContainer');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    if (container.children.length > 3) {
      container.removeChild(container.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

})();