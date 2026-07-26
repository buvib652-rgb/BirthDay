# 🎂 Romantic Birthday Website — Backend API

Production-ready Node.js + Express + MongoDB Atlas backend.

---

## 📦 Tech Stack

| Package | Purpose |
|---------|---------|
| Express.js | HTTP server & routing |
| MongoDB Atlas + Mongoose | Database |
| JWT + bcryptjs | Authentication & password hashing |
| Multer + Cloudinary | File/media uploads |
| Nodemailer | Email sending |
| node-cron | Scheduled tasks |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |
| express-validator | Input validation |
| compression | Response compression |
| morgan | HTTP request logging |
| winston | Application logging |
| cors | Cross-origin resource sharing |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Start Production Server
```bash
npm start
```

Server runs on: `http://localhost:5000`
Health check: `GET http://localhost:5000/health`

---

## 🗂️ Folder Structure

```
backend/
├── app.js                    ← Express app setup
├── server.js                 ← Entry point
├── package.json
├── .env.example              ← Environment template
├── .gitignore
│
├── config/
│   ├── db.js                 ← MongoDB Atlas connection
│   └── cloudinary.js         ← Cloudinary + Multer uploaders
│
├── controllers/
│   ├── auth.controller.js    ← Auth logic
│   ├── dashboard.controller.js ← Analytics
│   ├── gallery.controller.js ← Photo CRUD
│   ├── media.controller.js   ← Video/Voice/Music
│   ├── content.controller.js ← Letter/Timeline/Settings/Partner/Visitors
│   └── email.controller.js   ← Email sending
│
├── middleware/
│   ├── auth.middleware.js    ← JWT protect + adminOnly
│   ├── errorHandler.js       ← Global error handler
│   ├── notFoundHandler.js    ← 404 handler
│   └── validate.middleware.js ← express-validator wrapper
│
├── models/
│   ├── User.model.js
│   ├── Partner.model.js
│   └── models.js             ← All other models
│
├── routes/
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── gallery.routes.js
│   ├── video.routes.js
│   ├── voice.routes.js
│   ├── music.routes.js
│   ├── letter.routes.js
│   ├── timeline.routes.js
│   ├── settings.routes.js
│   ├── visitor.routes.js
│   ├── email.routes.js
│   └── partner.routes.js
│
├── services/
│   ├── email.service.js      ← Nodemailer transporter
│   └── scheduler.js          ← node-cron jobs
│
├── utils/
│   ├── logger.js             ← Winston logger
│   ├── jwt.utils.js          ← JWT helpers
│   └── apiResponse.js        ← Standardized responses
│
├── uploads/                  ← Temp local uploads (gitignored)
└── logs/                     ← Application logs (gitignored)
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your_long_secret_key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefgh` |
| `SMTP_HOST` | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Email username | `your@gmail.com` |
| `SMTP_PASS` | App password (not Gmail password!) | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-site.netlify.app` |

---

## 📡 Complete API Reference

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register admin (first time only) |
| POST | `/api/auth/login` | Public | Login → returns JWT |
| POST | `/api/auth/logout` | Admin | Clear token cookie |
| GET | `/api/auth/profile` | Admin | Get admin profile |
| PUT | `/api/auth/profile` | Admin | Update name/email |
| PUT | `/api/auth/change-password` | Admin | Change password |

**Login Request:**
```json
POST /api/auth/login
{
  "email": "admin@birthday.com",
  "password": "your_password"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "name": "Admin", "email": "admin@birthday.com", "role": "admin" }
}
```

---

### 📊 Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | Admin | Full stats + analytics |

**Response includes:**
- Gallery count, Timeline count, Voice count, Video count
- Total visitors, today's visitors, return visitors
- Country/device/browser distribution
- Visitors per day (last 7 days)

---

### 📸 Gallery

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gallery` | Public | Get all photos (paginated) |
| GET | `/api/gallery/:id` | Public | Get single photo |
| POST | `/api/gallery` | Admin | Upload 1-10 photos |
| PATCH | `/api/gallery/:id` | Admin | Update caption/order |
| DELETE | `/api/gallery/:id` | Admin | Delete photo |
| DELETE | `/api/gallery/bulk` | Admin | Bulk delete `{ ids: [...] }` |

**Upload photos:**
```
POST /api/gallery
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: images[] (up to 10 files), caption (optional)
```

---

### 🎬 Video Memory

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/videos` | Public | Get all videos |
| POST | `/api/videos` | Admin | Upload video |
| DELETE | `/api/videos/:id` | Admin | Delete video |

---

### 🎙️ Voice Message

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/voice` | Public | Get current voice message |
| POST | `/api/voice` | Admin | Upload new voice (replaces old) |
| DELETE | `/api/voice/:id` | Admin | Delete voice |

---

### 🎵 Background Music

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/music` | Public | Get current music |
| POST | `/api/music` | Admin | Upload new music (replaces old) |
| DELETE | `/api/music/:id` | Admin | Delete music |

---

### 💌 Love Letter

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/letter` | Public | Get love letter |
| POST | `/api/letter` | Admin | Create/replace letter |
| PUT | `/api/letter/:id` | Admin | Update letter |
| DELETE | `/api/letter/:id` | Admin | Delete letter |

---

### 📅 Timeline

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/timeline` | Public | Get all events |
| POST | `/api/timeline` | Admin | Create event |
| PUT | `/api/timeline/:id` | Admin | Update event |
| DELETE | `/api/timeline/:id` | Admin | Delete event |

---

### ⚙️ Settings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/settings` | Public | Get all settings |
| PUT | `/api/settings` | Admin | Update settings |

**Configurable settings:**
```json
{
  "theme": "dark",
  "primaryColor": "#c41e5a",
  "secondaryColor": "#ffd700",
  "countdownEnabled": true,
  "birthdayDate": "2025-12-25",
  "birthdayTime": "00:00",
  "musicEnabled": true,
  "animationsEnabled": true,
  "petalsEnabled": true,
  "fireworksEnabled": true,
  "hername": "Sarah",
  "loveStartDate": "2023-06-01"
}
```

---

### 👩 Partner Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/partner` | Public | Get partner info |
| PUT | `/api/partner` | Admin | Create/update partner |

---

### 👁️ Visitor Tracking

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/visitors` | Public | Track a visitor |
| GET | `/api/visitors` | Admin | List all visitors |

**Track visit from frontend:**
```json
POST /api/visitors
{
  "country": "India",
  "device": "mobile",
  "browser": "Chrome",
  "os": "Android",
  "screenWidth": 390,
  "screenHeight": 844,
  "sessionId": "abc123"
}
```

---

### 📧 Email

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/email/send-message` | Admin | Send romantic email |
| POST | `/api/email/test` | Admin | Test SMTP connection |

```json
POST /api/email/send-message
{
  "to": "girlfriend@example.com",
  "subject": "Happy Birthday My Love ❤️",
  "message": "You are the most amazing person...",
  "fromName": "Your Name"
}
```

---

## ⏰ Cron Jobs

| Schedule | Job |
|----------|-----|
| Daily 03:00 AM | Clean temp uploads older than 24h |
| Weekly Sunday 02:00 AM | Delete log files older than 30 days |
| Every 6 hours | MongoDB health check |
| Daily midnight | Log visitor count |
| Daily 08:00 AM | Send birthday reminder (1 day before) |

---

## 🌐 Deploy to Render

1. Push backend to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Set **Root Directory** to `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add all environment variables from `.env.example`
8. Deploy!

**CORS:** After deploying, set `FRONTEND_URL` to your Netlify/Vercel URL.

---

## 🧪 Testing with Postman

1. Import this collection structure
2. Set base URL variable: `{{BASE_URL}}` = `http://localhost:5000`
3. **Register admin first:**  
   `POST {{BASE_URL}}/api/auth/register`
4. **Login to get token:**  
   `POST {{BASE_URL}}/api/auth/login`
5. Add token to **Authorization: Bearer `{{token}}`** header
6. Test all routes

---

## 🛡️ Security Features

- **Helmet** — Security headers (XSS, clickjacking, MIME sniffing)
- **express-rate-limit** — 100 req/15min globally, 20 req/15min for auth
- **express-mongo-sanitize** — Prevents NoSQL injection (`$where`, `$gt` in body)
- **bcryptjs** — Passwords hashed with 12 rounds
- **JWT** — Stateless authentication with expiry
- **CORS** — Whitelist-only origins
- **Input validation** — express-validator on all write endpoints

---

## 📝 Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email required" }
  ]
}
```

## ✅ Success Response Format

```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "photo": { ... }
}
```
