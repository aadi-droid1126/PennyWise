const Budget = require("../models/Budget");

// @GET /api/budgets/:month/:year
const getBudget = async (req, res) => {
  try {
    const { month, year } = req.params;
    const budget = await Budget.findOne({
      userId: req.user.id,
      month: parseInt(month),
      year: parseInt(year),
    });

    if (!budget)
      return res
        .status(404)
        .json({ message: "No deadlights set for this month." });
    res.json(budget);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Budget fetch failed.", error: err.message });
  }
};

// @POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { month, year, limits } = req.body;

    const existing = await Budget.findOne({ userId: req.user.id, month, year });
    if (existing)
      return res
        .status(400)
        .json({
          message: "Deadlights already set for this month. Update instead.",
        });

    const budget = await Budget.create({
      userId: req.user.id,
      month,
      year,
      limits,
    });
    res
      .status(201)
      .json({
        message: "Deadlights set. IT is watching your spending. 🎈",
        budget,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Budget creation failed.", error: err.message });
  }
};

// @PUT /api/budgets/:id
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!budget) return res.status(404).json({ message: "Budget not found." });
    res.json({ message: "Deadlights updated.", budget });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Budget update failed.", error: err.message });
  }
};

module.exports = { getBudget, createBudget, updateBudget };
