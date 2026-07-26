# 🎂 Happy Birthday My Love — Luxury Romantic Birthday Surprise Website

A cinematic, luxury-quality romantic birthday surprise website that creates an emotional experience from beginning to end.

---

## 🚀 Quick Start

1. Open `index.html` in any modern browser — no server needed!
2. For PWA support, serve with a local HTTP server (see below)

### Simple local server options:

**Using Python:**
```bash
python -m http.server 8080
```
Then open: http://localhost:8080

**Using VS Code:**
Install the "Live Server" extension and click "Go Live"

---

## 📁 Folder Structure

```
Project/
├── index.html              ← Main page (all 22 sections)
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Offline support
├── README.md
│
├── css/
│   └── style.css           ← All styles (glassmorphism, animations)
│
├── js/
│   ├── main.js             ← Core logic, CONFIG, cursor, etc.
│   ├── countdown.js        ← Midnight countdown + celebration
│   ├── music.js            ← Music player
│   ├── gallery.js          ← Photo gallery + lightbox
│   ├── timeline.js         ← Our Story timeline
│   ├── effects.js          ← Rose petals, particles, GSAP
│   └── voice.js            ← Voice message playback
│
└── assets/
    ├── music/
    │   └── birthday.mp3    ← 🎵 ADD YOUR BACKGROUND MUSIC HERE
    ├── voice/
    │   └── happybirthday.mp3 ← 🎙️ ADD YOUR VOICE RECORDING HERE
    ├── images/
    │   └── gallery/        ← 📸 ADD YOUR PHOTOS HERE
    ├── videos/
    │   └── our-memory.mp4  ← 🎬 ADD YOUR VIDEO HERE (optional)
    └── icons/
        ├── icon-192.png    ← PWA icon (192×192)
        └── icon-512.png    ← PWA icon (512×512)
```

---

## ✏️ Customization Guide

### 1️⃣ Edit Personal Details
Open `js/main.js` and update the `CONFIG` object at the top:

```javascript
const CONFIG = {
  hername: 'My Love',           // ← Her name
  loveStartDate: '2023-01-15',  // ← When you started dating (YYYY-MM-DD)
  birthdayDate: '2025-01-15',   // ← Her birthday (YYYY-MM-DD)

  loveReasons: [
    { icon: '😊', text: 'Your smile lights up every room...' },
    // ... add more reasons!
  ],

  timelineEvents: [
    { emoji: '💬', date: 'January 2023', title: 'First Talk', desc: 'Your description...' },
    // ... customize each event!
  ],

  loveLetter: `Your custom letter text here...`,
};
```

### 2️⃣ Add Your Photos
Place photos in `assets/images/gallery/` then update `js/gallery.js`:

```javascript
const GALLERY_PHOTOS = [
  { src: 'assets/images/gallery/photo1.jpg', caption: 'Our First Photo ❤️' },
  { src: 'assets/images/gallery/photo2.jpg', caption: 'A Beautiful Memory' },
  // ... add all your photos
];
```

### 3️⃣ Add Background Music
- Place your MP3 in `assets/music/birthday.mp3`
- The player will auto-detect and play it

### 4️⃣ Add Voice Recording
- Record yourself saying "Happy Birthday!" on your phone
- Save it as `assets/voice/happybirthday.mp3`
- It plays automatically at midnight! 🎉

### 5️⃣ Add a Video Memory
- Place your video in `assets/videos/our-memory.mp4`
- Update the `<source>` tag in `index.html` if needed

### 6️⃣ PWA Icons
- Create two PNG icons: 192×192 and 512×512 pixels
- Use a heart or romantic design
- Place in `assets/icons/`

---

## 🌙 Midnight Surprise

The website automatically detects the local device time.

**Before midnight:** Shows a live countdown timer

**At exactly 00:00:00:**
- 🎂 Your custom voice recording plays
- 🎆 Fireworks launch
- 🎊 Massive confetti burst
- 💕 Heart explosion animation
- 🎈 Balloons float up
- 🌹 Rose petals intensify
- ✨ Screen glow effect
- 🔔 Browser notification (if allowed)
- 💌 "HAPPY BIRTHDAY MY LOVE" overlay

---

## 💡 Tips

- **Best experience:** Open on her phone browser, then "Add to Home Screen" for PWA
- **Share the link:** Host on GitHub Pages or Netlify for free
- **Timing:** Send her the link before midnight so she's ready!
- **Music:** Use a romantic song you both love
- **Voice:** Record something heartfelt — this is the most emotional part!

---

## 🌐 Free Hosting Options

1. **GitHub Pages** — Upload to a repo → Settings → Pages
2. **Netlify** — Drag and drop the folder on netlify.com
3. **Vercel** — Connect your GitHub repo

---

## ✨ Features

- 22 beautiful sections
- Glassmorphism design
- GSAP + AOS animations
- Typed.js text effects
- Canvas fireworks
- Canvas rose petals
- Canvas balloons (touch to pop!)
- Heart cursor trail
- Interactive heart rain
- Love meter animation
- Midnight auto-trigger
- PWA installable
- Offline support
- Fully responsive (mobile-first)
- Custom cursor
- No "No" button 😄

---

Made with ❤️ — A birthday she will never forget.
