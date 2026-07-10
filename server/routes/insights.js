const express = require("express");
const router = express.Router();
const { insightController } = require("../controllers/insightController");
const { protect } = require("../middleware/authMiddleware");
const { insightLimiter } = require("../middleware/rateLimiter");

router.post("/roast", protect, insightLimiter, insightController);

module.exports = router;
