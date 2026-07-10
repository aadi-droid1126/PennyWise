const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP. Even IT needs a break.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many attempts. Even IT is taking a break.",
});

const insightLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "IT has spoken enough for now. Try again later. 🎈",
});

module.exports = { globalLimiter, authLimiter, insightLimiter };
