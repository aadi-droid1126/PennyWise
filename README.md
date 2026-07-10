![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Production--Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Made By](https://img.shields.io/badge/Made%20By-Aditya%20Sharma-orange)

# 🎈 PennyWise — Horror-Themed MERN Expense Tracker

A **production-style expense tracker named PennyWise** built with the MERN stack, wrapped in an IT-inspired horror aesthetic. Track spending, savings goals, and budgets while getting sarcastically roasted by an AI clown for your financial decisions.

Designed as a **portfolio-grade full-stack system** showcasing AI integration, secure authentication, and a distinctive, memorable UX identity.

---

## 🚀 Live Capabilities

### 👤 Authentication & Security

- JWT-based authentication via httpOnly cookies
- Protected routes & API guards
- Rate limiting middleware

### 🎈 Expense & Goal Tracking

- Expense logging ("Floaters") categorized and tracked in INR (₹)
- Savings goals ("Escape from Derry") with animated balloon progress visuals
- Budget tracking with visual budget bars
- Streak tracking for consistent logging

### 🤡 AI-Powered Roasts

- Context-aware, sarcastic spending commentary powered by Groq (`llama-3.3-70b-versatile`)
- Voice narration via the Web Speech API (low pitch, slow rate, extra menace)
- Roasts adapt to dashboard, goals, and transaction context

### ✨ Premium UX Features

- Framer Motion micro-interactions & animations
- CSV export of transaction history
- Fully horror-themed naming conventions throughout (Floaters, The Lair, The Ritual, Sewer Map)
- Responsive, dark-mode-first design

---

## 🧠 Architecture Highlights

- Modular Express architecture (controllers, routes, middleware, models)
- RESTful API design
- JWT auth with middleware guards
- MongoDB relational modeling (Users ↔ Transactions ↔ Budgets ↔ Goals)
- Groq SDK integration for AI-generated, context-aware responses
- Clean separation of frontend & backend concerns

---

## 🛠 Tech Stack

### 🎨 Frontend

- React (Vite)
- Tailwind CSS
- Framer Motion
- Web Speech API (voice narration)

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (httpOnly cookies)
- Groq SDK (AI roasts)

### ☁️ Database

- MongoDB Atlas (cloud-ready)

---

## 📂 Project Structure

```
PennyWise
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
├── client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public
│   │   ├── favicon.svg
│   │   ├── manifest.json
│   │   └── icons/
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── assets/
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── features/
│       │   │   ├── BudgetBar.jsx
│       │   │   ├── GoalCard.jsx
│       │   │   ├── PennywiseRoast.jsx
│       │   │   ├── PennywiseVoice.jsx
│       │   │   └── TransactionRow.jsx
│       │   └── ui/
│       │       ├── Button.jsx
│       │       ├── Panel.jsx
│       │       └── StatCard.jsx
│       ├── context
│       │   └── AuthContext.jsx
│       ├── hooks
│       │   ├── useBudget.js
│       │   ├── useGoals.js
│       │   ├── useStreak.js
│       │   └── useTransactions.js
│       ├── pages
│       │   ├── Dashboard.jsx
│       │   ├── EscapeFromDerry.jsx
│       │   ├── LosersLog.jsx
│       │   ├── SewerMap.jsx
│       │   ├── TheCaseFile.jsx
│       │   ├── TheLair.jsx
│       │   └── TheRitual.jsx
│       ├── services
│       │   └── api.js
│       └── utils
│           ├── contextualRoast.js
│           ├── dateHelpers.js
│           ├── formatters.js
│           └── voiceNarrator.js
└── server
    ├── index.js
    ├── package.json
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

---

## 🎯 Key Engineering Highlights

- Built with a **scalable, feature-first folder architecture**
- Integrates a **third-party LLM API (Groq)** for dynamic, context-aware content generation
- Implements **production-grade UX polish** with animation and voice
- Demonstrates **full-stack ownership** across auth, data modeling, and AI integration
- Portfolio-focused **clean, distinctively themed codebase**

---

## 📸 Screenshots

> Add screenshots here:

- Dashboard ("The Lair")
- Goals with balloon progress ("Escape from Derry")
- AI roast in action
- Transaction history

---

## ⚙️ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/aadi-droid1126/PennyWise.git
cd PennyWise
```

### 2️⃣ Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside `server/` (use `.env.example` as reference):

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

### 4️⃣ Run Locally

```bash
# In server/
npm start

# In client/ (separate terminal)
npm run dev
```

Client runs on `http://localhost:5173` and proxies API requests to the server.

---

## ☁️ Deployment

Deployed as two separate services:

- **Backend** (`server/`) — Web Service, build with `npm install`, start with `npm start`
- **Frontend** (`client/`) — Static Site, build with `npm run build`, publish directory `dist`

Set the same variables from `.env` in your hosting provider's dashboard — never commit `.env` to version control.

---

## 👨‍💻 Author

**Aditya Sharma**

GitHub: https://github.com/aadi-droid1126

LinkedIn: https://linkedin.com/in/aaditya-sharma-/

## 💼 Resume Bullet

**Full-stack MERN PennyWise**

Built PennyWise—a horror-themed expense tracker with AI-powered spending roasts, animated goal tracking, and voice narration using the MERN stack, implementing JWT authentication, Groq LLM integration, and modular backend architecture.

---

## License

MIT
