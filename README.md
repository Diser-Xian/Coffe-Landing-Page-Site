# ☕ Brew & Co. — Coffee Shop Landing Page

A fully responsive, professional coffee shop website with an admin panel built using vanilla HTML, CSS, and JavaScript. No frameworks, no backend — just clean, modern code.

## 🚀 Features

### Customer-Facing Website
- **Hero Section**: Eye-catching landing with dynamic content and call-to-action
- **About Section**: Company story and values (fully editable)
- **Featured Products**: Coffee menu with images, prices, and descriptions
- **Testimonials**: Customer reviews and feedback
- **Events Page**: Upcoming workshops, tastings, and special events
- **Contact Page**: Contact form, business details, and Google Maps integration
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop

### Admin Panel
- **Password Protection**: Simple frontend authentication (password: `admin123`)
- **Content Management**: Edit hero text, about section, footer content
- **Events Management**: Add, edit, and delete events
- **Products Management**: Manage coffee menu items
- **Google Maps**: Update map embed URL
- **Contact Info**: Update phone, email, and address
- **Real-time Preview**: Changes saved to localStorage instantly

### Technical Features
- ✅ Vanilla JavaScript (no frameworks)
- ✅ localStorage for data persistence
- ✅ Smooth scroll animations
- ✅ Toast notifications
- ✅ Mobile-first responsive design
- ✅ Theme switching (dark/light)
- ✅ Professional UI/UX design
- ✅ Coffee-themed color palette

## 📁 Project Structure

```
/coffee-landing-page
│
├── index.html                  # Main landing page
├── /pages
│   ├── events.html            # Events listing page
│   ├── contact.html           # Contact form & map
│   └── admin.html             # Admin panel
│
├── /assets
│   ├── /css
│   │   ├── style.css          # Main stylesheet
│   │   └── admin.css          # Admin panel styles
│   │
│   └── /js
│       ├── storage.js         # localStorage CRUD functions
│       ├── main.js            # Landing page logic
│       └── admin.js           # Admin panel logic
```

## 🎨 Design

**Color Palette:**
- **Dark Theme** (Default): Deep espresso tones with warm brown accents
- **Light Theme**: Cream and tan with coffee-inspired highlights
- **Accent**: Caramel/burnt orange (#c8722a)

**Typography:**
- **Headings**: Playfair Display (serif, elegant)
- **Body**: DM Sans (clean, readable)

**Visual Style:**
- Coffee-themed dark UI
- Card-based layouts
- Smooth animations and transitions
- Professional photography (via Unsplash)

## 🚦 Getting Started

### 1. Open the Website
Simply open `index.html` in any modern web browser:
```bash
# Option 1: Double-click index.html
# Option 2: Use a local server (recommended)
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

### 2. Access Admin Panel
1. Navigate to `/pages/admin.html` or click "Admin" in the navigation
2. Login with password: `admin123`
3. Start editing content!

### 3. Customize Content
In the admin panel, you can:
- Update hero headline and subtitle
- Edit the "About Us" story
- Add/remove events
- Manage coffee products
- Change contact information
- Update Google Maps embed

## 🔐 Admin Panel Guide

### Login
- **URL**: `/pages/admin.html`
- **Password**: `admin123` (stored in `storage.js` — change it there)
- **Session**: Uses `sessionStorage` (logs out when browser closes)

### Content Tab
- Hero section text (headline, subtitle, CTA button)
- About section (title and story)
- Contact info (phone, email, address)
- Google Maps embed URL
- Footer text

### Events Tab
- Add new events with title, date, time, description, and image
- Edit existing events
- Delete events
- All changes save to localStorage instantly

### Products Tab
- Add coffee products with name, price, description, and image
- Edit or delete products
- Manage featured menu items

## 🗄️ Data Storage

All data is stored in the browser's `localStorage`:

| Key | Description |
|-----|-------------|
| `brew_events` | Array of event objects |
| `brew_products` | Array of product objects |
| `brew_settings` | Site-wide settings (text, contact, etc.) |
| `brew_testimonials` | Customer testimonials |
| `brew_theme` | Current theme (dark/light) |
| `brew_admin` (sessionStorage) | Admin login status |

### Default Data
The app comes with pre-populated default data:
- 3 sample events
- 6 featured coffee products
- 3 testimonials
- Complete site content

You can reset to defaults anytime via the "Reset to Defaults" button in the admin panel.

## 🛠️ Customization

### Change Admin Password
Edit `/assets/js/storage.js`:
```javascript
function adminLogin(password) {
  if (password === 'YOUR_NEW_PASSWORD') { // Change this
    sessionStorage.setItem('brew_admin', 'true');
    return true;
  }
  return false;
}
```

### Add More Images
Replace Unsplash URLs with your own:
1. Upload images to a hosting service
2. Copy the image URL
3. Paste in admin panel or directly in the data objects

### Modify Colors
Edit CSS variables in `/assets/css/style.css`:
```css
:root {
  --accent: #c8722a;  /* Primary accent color */
  --accent-2: #e8a050; /* Lighter accent */
  /* ... */
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

The design is mobile-first, meaning it's optimized for small screens and scales up.

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Requires modern browser with ES6+ support and localStorage.

## 📝 To-Do / Future Enhancements

- [ ] Add image upload functionality (currently URL-based)
- [ ] Implement search/filter for events and products
- [ ] Add newsletter subscription
- [ ] Online ordering integration
- [ ] Multi-language support
- [ ] Backend integration (optional)

## 🤝 Credits

- **Images**: [Unsplash](https://unsplash.com)
- **Icons**: Emoji (native)
- **Fonts**: Google Fonts (Playfair Display, DM Sans)

## 📄 License

Free to use for personal and commercial projects. Attribution appreciated but not required.

---

**Built with ☕ and vanilla JavaScript**

For questions or support, contact: hello@brewandco.com
