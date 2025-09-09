# airCeption Website

## 1) Overview
airCeption® delivers ambient, AI-enabled room-based continence monitoring with caregiver web/mobile apps and API integration.  
This repository contains the source code, assets, and documentation for the official landing page.

---

## 2) Tech Stack
- **HTML5** (semantic markup, responsive layout)
- **CSS3** with **Bootstrap 5.3** (layout, grid, components)
- **Bootstrap Icons** for consistent iconography
- **Vanilla JavaScript (ES6)** for interactivity (smooth scroll, form handling, menu collapse)
- No bundler required: pure static site, easy to deploy.

---

## 3) File Structure
```
airCeption/
├── index.html               # Main landing page
├── styles.css               # Custom styles (brand colors, overrides)
├── script.js                # Smooth scroll, form handling, navbar behavior
├── README.md                # Documentation
└── img/                     # Images & assets
    ├── airCeption-banner-logo-1.png
    ├── airCeption-banner-logo-2.png
    ├── Marketing-image-1.jpg         # Hero background
    ├── Marketing-Image2.png          # "How It Works" diagram
    ├── value.png                     # Value-Based Care contextual image
    ├── product-1.png ... product-7.png # Device shots for carousel
    ├── demo.jpeg                     # Book a Demo image
    ├── ireland.jpg uk.jpg usa.jpg    # Flags for badges
    ├── john-kelly.png iain-warner.png # Leadership headshots
    └── airCeption_posts.jpg          # Testimonial image
```

---

## 4) Sections (IA)
1. **Hero** — Headline, subheadline, primary CTAs (“See How It Works” / “Book a Demo”), benefit stats.
2. **Value-Based Care Outcomes** — Four feature cards (Dignity, Staff Efficiency, Clinical Outcomes, Cost Savings) + contextual image.
3. **Key Features** — Device carousel (4:3 ratio) + four feature tiles (UI, FI, Tracked Events, 6+ Hours Saved).
4. **How It Works** — Step-by-step (Install, Monitor, Alert, Respond) with supporting diagram.
5. **Book a Demo** — Form with flags, input fields, consent checkbox, integrated mailto.
6. **Leadership Team** — Cards for John Kelly (Founder & CEO) and Iain Warner (Co-Founder & CTO) with LinkedIn links.
7. **FAQ** — Accordion with clear answers to common questions.
8. **Testimonials** — Quote from care staff with supporting imagery.
9. **Footer** — Brand, copyright, Privacy Policy modal, Partner Login.

---

## 5) Features
- Fully responsive (desktop, tablet, mobile)
- Mobile menu with collapsible hamburger and auto-close
- Smooth scrolling with offset for fixed navbar
- Form validation with honeypot anti-spam
- `mailto:` integration with official recipient(s)
- Accessibility tags (aria-controls, aria-expanded, alt text)

---

## 6) Deployment
The site is static — it can be hosted on:
- GitHub Pages
- Netlify / Vercel
- Hostinger (domain + hosting, recommended by project lead)

---

## 7) How to Run Locally
1. Clone or download this repository.  
2. Open `index.html` directly in a browser.  
3. No build tools required — works out-of-the-box.

---

## 8) Contributing
For edits: duplicate card/accordion items as templates.  
- **Images**: keep 4:3 ratio in carousel.  
- **FAQ**: duplicate a block and update IDs.  
- **Team members**: duplicate a card and update avatar.

---

## 9) License
© airCeption®. All rights reserved.  
Third-party libraries under their respective licenses.

---

## 10) Contact
- Web/demo inquiries: [demo@airception.com](mailto:demo@airception.com)  
- Partner Login: [login.airception.com](https://login.airception.com)
