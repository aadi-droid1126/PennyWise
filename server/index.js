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

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://pennywise-k9xa.onrender.com",
      ];
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
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/insights", insightRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "We all spend down here. 🎈" });
});

// Error handler
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🎈 Connected to MongoDB — entered the sewer");
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `🩸 Pennywise server running on port ${process.env.PORT || 5000}`,
      );
    });
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
