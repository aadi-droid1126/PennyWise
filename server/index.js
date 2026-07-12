const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budgets");
const goalRoutes = require("./routes/goals");
const errorHandler = require("./middleware/errorHandler");
const { globalLimiter, authLimiter } = require("./middleware/rateLimiter");
const exportRoutes = require("./routes/export");
const insightRoutes = require("./routes/insights");

dotenv.config({ path: "../.env" });

const app = express();

// Render sits behind a proxy — needed for correct IPs in rate limiting / logging
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://pennywise-k9xa.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith("http://localhost:") ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
// Explicitly handle preflight for all routes so OPTIONS never falls through

app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

// Health check — hit this directly to confirm the server (not just Mongo) is up
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// Base route
app.get("/", (req, res) => {
  res.json({ message: "We all spend down here. 🎈" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/insights", insightRoutes);

// Error handler
app.use(errorHandler);

// Start the HTTP server immediately, independent of Mongo.
// This means CORS preflight and health checks always work,
// even if the DB is slow, cold, or briefly unreachable.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🩸 Pennywise server running on port ${PORT}`);
});

// Connect to MongoDB separately — log clearly if it fails, but don't block the server.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🎈 Connected to MongoDB — entered the sewer");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });