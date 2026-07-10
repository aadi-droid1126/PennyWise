const Transaction = require("../models/Transaction");

// @GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { month, year, type, category } = req.query;
    const filter = { userId: req.user.id };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The sewer is backed up.", error: err.message });
  }
};

// @POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      note,
      isRecurring,
      recurringInterval,
      date,
    } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      category,
      note,
      isRecurring: isRecurring || false,
      recurringInterval: recurringInterval || null,
      date: date || Date.now(),
    });

    res
      .status(201)
      .json({ message: "Floater added. IT is pleased.", transaction });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add floater.", error: err.message });
  }
};

// @PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!transaction)
      return res
        .status(404)
        .json({ message: "Floater not found in the sewer." });

    res.json({ message: "Floater updated.", transaction });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update floater.", error: err.message });
  }
};

// @DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction)
      return res.status(404).json({ message: "Floater not found." });

    res.json({ message: "Floater removed. IT is disappointed." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove floater.", error: err.message });
  }
};

// @GET /api/transactions/summary
const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    });

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    res.json({
      income,
      expenses,
      balance: income - expenses,
      byCategory,
    });
  } catch (err) {
    res.status(500).json({ message: "Summary failed.", error: err.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
