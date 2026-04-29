// ============================================================
// storage.js — Reusable localStorage CRUD for Brew & Co.
// ============================================================

const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "Morning Pour-Over Workshop",
    date: "2026-05-10",
    time: "9:00 AM",
    description: "Learn the art of pour-over brewing from our head barista. All equipment provided. Limited to 12 participants.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"
  },
  {
    id: 2,
    title: "Coffee & Jazz Night",
    date: "2026-05-17",
    time: "7:00 PM",
    description: "Sip specialty blends while local jazz musicians set the mood. Reservations recommended.",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&q=80"
  },
  {
    id: 3,
    title: "Latte Art Competition",
    date: "2026-05-24",
    time: "2:00 PM",
    description: "Compete or spectate as our baristas and guests battle for the best latte art. Prizes for top 3!",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80"
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Signature Espresso",
    price: "$4.50",
    description: "Bold, velvety espresso with notes of dark chocolate and a hint of caramel. Our most beloved classic.",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80"
  },
  {
    id: 2,
    name: "Cold Brew Reserve",
    price: "$5.50",
    description: "18-hour slow-steeped cold brew, silky smooth with low acidity and rich, roasted depth.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80"
  },
  {
    id: 3,
    name: "Honey Oat Latte",
    price: "$6.00",
    description: "House-made oat milk, wildflower honey, and our single-origin espresso — a warm, golden delight.",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80"
  },
  {
    id: 4,
    name: "Ethiopian Pour-Over",
    price: "$5.00",
    description: "Single-origin beans from Yirgacheffe, Ethiopia. Bright and fruity with jasmine and blueberry notes.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"
  },
  {
    id: 5,
    name: "Matcha Cortado",
    price: "$5.75",
    description: "Ceremonial-grade matcha balanced with our espresso, creating an earthy, creamy harmony.",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80"
  },
  {
    id: 6,
    name: "Spiced Chai Latte",
    price: "$5.25",
    description: "House-brewed masala chai with steamed whole milk, cinnamon, cardamom, and a touch of ginger.",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80"
  }
];

const DEFAULT_SETTINGS = {
  heroHeadline: "Where Every Cup\nTells a Story",
  heroSubtitle: "Specialty coffee roasted with passion, served with soul. Find your moment at Brew & Co.",
  heroCta: "Explore Our Menu",
  aboutTitle: "Our Story",
  aboutText: "Born from a single obsession — the perfect cup — Brew & Co. has been a gathering place for coffee lovers since 2012. We source directly from small-batch farms across Ethiopia, Colombia, and Guatemala, roasting in-house to honor each bean's origin.\n\nOur baristas aren't just staff; they're craftspeople dedicated to precision and warmth. Whether you're chasing your morning ritual or a slow Saturday afternoon, we pour our hearts into every cup.\n\nStep in. Slow down. Taste the difference.",
  footerText: "© 2026 Brew & Co. All rights reserved. Made with ☕ and love.",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968502!3d40.75889497932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767536",
  phone: "+1 (555) 234-5678",
  email: "hello@brewandco.com",
  address: "42 Maple Street, Brooklyn, NY 11201"
};

const DEFAULT_TESTIMONIALS = [
  { id: 1, name: "Marisol R.", role: "Food Blogger", text: "The best pour-over I've had outside of Tokyo. Brew & Co. is the real deal — the beans, the technique, the vibe." },
  { id: 2, name: "James T.", role: "Regular Customer", text: "I've tried every coffee shop in the neighborhood. Nothing comes close. The honey oat latte alone is worth the trip." },
  { id: 3, name: "Priya M.", role: "Remote Worker", text: "My office away from the office. The WiFi is great, the music is perfect, and the cold brew keeps me going all day." }
];

// ── Events ─────────────────────────────────────────────────
function getEvents() {
  const raw = localStorage.getItem('brew_events');
  return raw ? JSON.parse(raw) : DEFAULT_EVENTS;
}
function saveEvents(events) {
  localStorage.setItem('brew_events', JSON.stringify(events));
}

// ── Products ───────────────────────────────────────────────
function getProducts() {
  const raw = localStorage.getItem('brew_products');
  return raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
}
function saveProducts(products) {
  localStorage.setItem('brew_products', JSON.stringify(products));
}

// ── Settings ──────────────────────────────────────────────
function getSettings() {
  const raw = localStorage.getItem('brew_settings');
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}
function saveSettings(settings) {
  localStorage.setItem('brew_settings', JSON.stringify(settings));
}

// ── Testimonials ──────────────────────────────────────────
function getTestimonials() {
  const raw = localStorage.getItem('brew_testimonials');
  return raw ? JSON.parse(raw) : DEFAULT_TESTIMONIALS;
}
function saveTestimonials(testimonials) {
  localStorage.setItem('brew_testimonials', JSON.stringify(testimonials));
}

// ── Auth ──────────────────────────────────────────────────
function isAdminLoggedIn() {
  return sessionStorage.getItem('brew_admin') === 'true';
}
function adminLogin(password) {
  if (password === 'admin123') {
    sessionStorage.setItem('brew_admin', 'true');
    return true;
  }
  return false;
}
function adminLogout() {
  sessionStorage.removeItem('brew_admin');
}

// ── ID generator ──────────────────────────────────────────
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
