const express = require("express");
const router = express.Router();
const {
  getBudget,
  createBudget,
  updateBudget,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/:month/:year", getBudget);
router.post("/", createBudget);
router.put("/:id", updateBudget);

module.exports = router;
