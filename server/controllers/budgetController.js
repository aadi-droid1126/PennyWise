const Budget = require("../models/Budget");

// @GET /api/budgets — all budgets for the logged-in user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({
      year: -1,
      month: -1,
    });
    res.json(budgets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Budget fetch failed.", error: err.message });
  }
};

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

// @POST /api/budgets — creates the month's doc if none exists, otherwise
// merges the incoming category limit into the existing doc instead of
// rejecting with a duplicate error.
const createBudget = async (req, res) => {
  try {
    const { month, year, limits } = req.body;

    let budget = await Budget.findOne({ userId: req.user.id, month, year });

    if (!budget) {
      budget = await Budget.create({ userId: req.user.id, month, year, limits });
      return res
        .status(201)
        .json({ message: "Deadlights set. IT is watching your spending. 🎈", budget });
    }

    (limits || []).forEach((incoming) => {
      const idx = budget.limits.findIndex((l) => l.category === incoming.category);
      if (idx >= 0) budget.limits[idx].amount = incoming.amount;
      else budget.limits.push(incoming);
    });

    await budget.save();
    res.json({ message: "Deadlights updated. IT never forgets. 🎈", budget });
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

// @DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) return res.status(404).json({ message: "Budget not found." });
    res.json({ message: "Deadlight lifted." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Budget delete failed.", error: err.message });
  }
};

module.exports = { getBudgets, getBudget, createBudget, updateBudget, deleteBudget };
