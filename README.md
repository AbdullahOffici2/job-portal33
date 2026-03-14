# 💼 TalentBridge – Job Portal

A complete, full-stack job portal with a landing page, job listings, application form, login & registration — all connected to a Node.js + Express + MongoDB backend.

---

## 📁 Project Structure

```
jobportal/
├── frontend/                 ← All HTML pages + shared CSS
│   ├── index.html            ← 🏠 Landing page (hero, stats, featured jobs, testimonials)
│   ├── jobs.html             ← 🔍 Browse & filter all job listings
│   ├── apply.html            ← 📋 Job application form (with PDF resume upload)
│   ├── login.html            ← 🔐 User login
│   ├── register.html         ← 🚀 User registration
│   └── style.css             ← 🎨 Unified stylesheet for all pages
│
└── backend/
    ├── server.js             ← ⚙️  Express server (API + static file serving)
    ├── package.json          ← 📦 Dependencies
    ├── .env.example          ← 🔧 Copy to .env and configure
    ├── uploads/              ← 📁 Auto-created; stores PDF resumes
    └── models/
        ├── User.js           ← 👤 Mongoose schema for users
        └── Application.js    ← 📄 Mongoose schema for job applications
```

---

## 🚀 How to Run

### Step 1 – Prerequisites (install once)
- **Node.js** → https://nodejs.org (download LTS version)
- **MongoDB** → https://www.mongodb.com/try/download/community

### Step 2 – Install dependencies
```bash
cd jobportal/backend
npm install
```

### Step 3 – Configure (optional)
```bash
cp .env.example .env
# Edit .env if you want a custom port or MongoDB URI
```

### Step 4 – Start MongoDB
Open a terminal and run:
```bash
mongod
```
Keep this terminal open.

### Step 5 – Start the server
In a new terminal:
```bash
cd jobportal/backend
node server.js
```

You should see:
```
🚀  Server running at http://localhost:3000
✅  MongoDB connected
```

### Step 6 – Open in browser
Go to: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Route               | Description                     |
|--------|---------------------|---------------------------------|
| POST   | /api/register       | Register a new user             |
| POST   | /api/login          | Login with email & password     |
| POST   | /api/apply          | Submit job application + PDF    |
| GET    | /api/applications   | List all applications (admin)   |

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JS (Fetch API)|
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | bcryptjs (password hashing)       |
| File Upload| Multer (PDF only, max 5 MB)       |
| CORS       | cors middleware                   |

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---|---|
| "Network error" in browser | Make sure `node server.js` is running AND open via `http://localhost:3000` not `file://...` |
| MongoDB connection error | Run `mongod` in a separate terminal first |
| Cannot find module | Run `npm install` inside the `backend/` folder |
| Port already in use | Change `PORT=3001` in your `.env` file |
