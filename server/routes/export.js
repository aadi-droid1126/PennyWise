const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const { generateCSV } = require("../utils/csvGenerator");

router.get("/csv", protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { userId: req.user.id };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    const csv = generateCSV(transactions);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="pennywise-the-case-file-${month || "all"}-${year || "time"}.csv"`,
    );

    res.send(csv);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "The Case File could not be generated.",
        error: err.message,
      });
  }
});

module.exports = router;
