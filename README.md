![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Production--Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Made By](https://img.shields.io/badge/Made%20By-Aditya%20Sharma-orange)

# 🎈 PennyWise — Horror-Themed MERN Expense Tracker

A **production-style expense tracker named PennyWise** built with the MERN stack, wrapped in an IT-inspired horror aesthetic. Track spending, savings goals, budgets, and recurring bills while getting sarcastically roasted by an AI clown for your financial decisions.

Designed as a **portfolio-grade full-stack system** showcasing AI integration, secure authentication, and a distinctive, memorable UX identity.

**🔗 Live Demo:** [pennywise-k9xa.onrender.com](https://pennywise-k9xa.onrender.com)

---

## 🚀 Live Capabilities

### 👤 Authentication & Security

- JWT-based authentication via httpOnly cookies
- Cross-origin cookie auth configured for separate frontend/backend Render deployments (`sameSite: "none"`, `secure: true` in production)
- Protected routes & API guards
- Tiered rate limiting — a global cap, a stricter cap on auth endpoints (brute-force protection), and a dedicated cap on AI-roast requests (Groq cost control)

### 🎈 Expense & Goal Tracking

- Expense logging ("Floaters") categorized and tracked in INR (₹)
- Savings goals ("Escape from Derry") with progress bars and Framer Motion transitions
- Budget limits ("The Deadlights") — set, edit, and remove per-category monthly limits from the UI; bars shift color at 80% utilization and flag "IT Whispers" once a category goes over
- Recurring payments ("The Ritual") — schedule recurring expenses or income by frequency (daily/weekly/monthly/yearly), with rolled-up monthly drain/flow totals
- **Days Since IT Appeared** — streak counter tracking consecutive days of logged activity

### 🤡 AI-Powered Roasts

- Context-aware, sarcastic spending commentary powered by Groq (`llama-3.3-70b-versatile`)
- Ambient, unprompted narration — Pennywise speaks on his own on a randomized interval, plus event-triggered lines for a low balance, an exceeded budget, a new expense/income entry, or a completed goal
- Voice narration via the Web Speech API — dynamic "scariest available voice" selection, clause-by-clause pacing, and per-line pitch/rate variation so it doesn't sound robotic
- Falls back to a curated pool of pre-written lines per context if the Groq call fails, so there's always something to say
- Roasts and voice lines adapt across the dashboard, transactions, goals, recurring payments, budgets, and export flows

### ✨ Premium UX Features

- Framer Motion micro-interactions & animations
- **Dual export** — download transaction history as CSV or a generated PDF case file (via jsPDF)
- **Multi-chart analytics** ("Sewer Map") — category breakdown, income vs. expenses, and balance-over-time via Recharts
- **Mobile bottom navigation** — 5-icon tab bar with a center FAB, fully independent of desktop layout
- Fully horror-themed naming conventions throughout (Floaters, The Lair, The Ritual, The Deadlights, Sewer Map)
- Responsive, dark-mode-first, mobile-first design

---

## 🧠 Architecture Highlights

- Modular Express architecture (controllers, routes, middleware, models)
- RESTful API design
- JWT auth with middleware guards
- MongoDB relational modeling (Users ↔ Transactions ↔ Budgets ↔ Recurring ↔ Savings Goals)
- Groq SDK integration for AI-generated, context-aware responses, backed by a server-side prompt builder and a client-side fallback line pool so the feature degrades gracefully if the API call fails
- Shared `Layout` component driving consistent navigation (sidebar + bottom nav) across most authenticated pages (Dashboard currently keeps its own copy — see Known Issues)
- Clean separation of frontend & backend concerns
- `/health` endpoint on the backend for deploy verification (server + MongoDB connection status)

---

## 🛠 Tech Stack

### 🎨 Frontend

- React (Vite)
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Recharts
- jsPDF (client-side PDF export)
- Web Speech API (voice narration)

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (httpOnly cookies)
- express-rate-limit
- Groq SDK (AI roasts)

### ☁️ Database

- MongoDB Atlas (cloud-ready)

---

## 📂 Project Structure

```
PennyWise
├── .gitignore
├── LICENSE
├── package.json
├── README.md
├── client
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── manifest.json
│   │   └── icons/
│   │       └── icon.svg
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── assets/
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── BottomNav.jsx
│       │   ├── features/
│       │   │   ├── BudgetBar.jsx
│       │   │   ├── GoalCard.jsx
│       │   │   ├── PennywiseRoast.jsx
│       │   │   ├── PennywiseVoice.jsx
│       │   │   ├── StreakBadge.jsx
│       │   │   └── TransactionRow.jsx
│       │   └── ui/
│       │       ├── Button.jsx
│       │       ├── Panel.jsx
│       │       └── StatCard.jsx
│       ├── context
│       │   ├── AuthContext.jsx
│       │   └── PennywiseVoiceContext.jsx
│       ├── hooks
│       │   ├── useBudget.js
│       │   ├── useGoals.js
│       │   ├── usePennywiseAmbient.js
│       │   ├── useRecurring.js
│       │   ├── useStreak.js
│       │   └── useTransactions.js
│       ├── pages
│       │   ├── Dashboard.jsx
│       │   ├── EscapeFromDerry.jsx
│       │   ├── LosersLog.jsx
│       │   ├── SewerMap.jsx
│       │   ├── TheCaseFile.jsx
│       │   ├── TheDeadlights.jsx
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
    ├── controllers
    │   ├── authController.js
    │   ├── budgetController.js
    │   ├── goalController.js
    │   ├── insightController.js
    │   ├── recurringController.js
    │   └── transactionController.js
    ├── middleware
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── rateLimiter.js
    ├── models
    │   ├── Budget.js
    │   ├── Recurring.js
    │   ├── SavingsGoal.js
    │   ├── Transaction.js
    │   └── User.js
    ├── routes
    │   ├── auth.js
    │   ├── budgets.js
    │   ├── export.js
    │   ├── goals.js
    │   ├── insights.js
    │   ├── recurring.js
    │   └── transactions.js
    └── utils
        ├── aiPromptBuilder.js
        └── csvGenerator.js
```

---

## 🎯 Key Engineering Highlights

- Built with a **scalable, feature-first folder architecture**
- Integrates a **third-party LLM API (Groq)** for dynamic, context-aware content generation, with a graceful fallback path when the API is unavailable
- Implements **production-grade UX polish** with animation, ambient voice, and adaptive navigation
- Demonstrates **full-stack ownership** across auth, data modeling, AI integration, and deployment
- Portfolio-focused **clean, distinctively themed codebase**
- Deployed and live on Render, with automatic redeploys on every commit
- Debugged and resolved cross-origin auth issues specific to deploying frontend and backend as separate services (CORS preflight, cookie `SameSite` policy, Express 5 routing changes)

---

## ⚠️ Known Issues / In Progress

Being transparent about current gaps rather than overstating what's shipped:

- [ ] PWA install experience is still broken — `manifest.json` isn't linked from `index.html`, and none of the icon files it references (`icon-16.png` through `icon-512.png`) exist yet; only a source `icon.svg` does
- [ ] Tailwind is installed but not registered in the Vite build (no plugin in `vite.config.js`, no `@import` in `index.css`). Most of the UI uses inline styles or scoped `<style>` blocks so it still renders, but a few components — the goals page, the AI roast card, and the voice button/toast — lean on Tailwind utility classes that currently do nothing
- [ ] Dashboard still duplicates its own sidebar/topbar instead of using the shared `Layout` component, and the two nav lists have drifted apart — Budgets is currently only linkable from Dashboard's copy
- [ ] Ambient voice timing is still set to testing values (fires every 15–30s at a 90% chance) rather than the production cadence noted in the code's own comments (90s–4min at 40%)
- [ ] A few loose ends from the cleanup pass: `html2canvas` and `express-validator` are installed but unused, `hero.png` isn't referenced anywhere, and a stray `icons.svg` sits outside `public/icons/`
- [ ] `.github/workflows/deno.yml` is a leftover Deno CI workflow — this is a Node/Express project, so it fails on every push/PR as-is

---

## 📸 Screenshots

> Add screenshots here:

- Dashboard ("The Lair") with streak counter
- Goals with progress tracking ("Escape from Derry")
- Budgets with category limits ("The Deadlights")
- Recurring payments ("The Ritual")
- AI roast in action
- Mobile bottom navigation
- The Case File — CSV / PDF export

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

Create a `.env` file at the **project root** — `server/index.js` loads it from one level up (`dotenv.config({ path: "../.env" })`), so it belongs next to `client/` and `server/`, not inside `server/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Create a separate `.env` file inside `client/` (Vite loads this one automatically):

```
VITE_API_URL=http://localhost:5000
```

> Never commit either `.env` file to version control.

### 4️⃣ Run Locally

**Option A — one command from the project root:**

```bash
npm install       # once, to get concurrently
npm run dev
```

**Option B — two terminals:**

```bash
# In server/
npm start

# In client/ (separate terminal)
npm run dev
```

Client runs on `http://localhost:5173` and proxies API requests to the server.

### 5️⃣ Verify the Backend

Once running, check:

```
GET http://localhost:5000/health
```

Should return `{ "status": "ok", "mongoConnected": true }`.

---

## ☁️ Deployment

Deployed as two separate services on Render:

- **Backend** (`server/`) — Web Service, build with `npm install`, start with `npm start`
- **Frontend** (`client/`) — Static Site, build with `npm run build`, publish directory `dist`

Set the same variables from `.env` in your hosting provider's dashboard — never commit `.env` to version control. MongoDB Atlas Network Access must allow the backend's outbound IP (or `0.0.0.0/0` for simplicity). The static site includes a catch-all rewrite (`/*` → `/index.html`) so client-side routes survive a page refresh.

**Cross-origin note:** because the frontend and backend run on different Render domains, auth cookies must be set with `sameSite: "none"` and `secure: true` in production for the browser to send them back on API requests. Locally, this falls back to `sameSite: "lax"` since both run over plain HTTP on `localhost`.

Use `GET /health` on the deployed backend to confirm the server is live and MongoDB is connected before debugging frontend issues.

---

## 👨‍💻 Author

**Aditya Sharma**

GitHub: https://github.com/aadi-droid1126

LinkedIn: https://linkedin.com/in/aaditya-sharma-/

## 💼 Resume Bullet

**Full-stack MERN PennyWise**

Built PennyWise—a horror-themed expense tracker with AI-powered spending roasts, animated goal tracking, streak tracking, and dual CSV/PDF export using the MERN stack, implementing JWT authentication, Groq LLM integration, adaptive mobile/desktop navigation, and modular backend architecture. Deployed live on Render.

---

## License

MIT