const SavingsGoal = require("../models/SavingsGoal");

// @GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch goals.", error: err.message });
  }
};

// @POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const goal = await SavingsGoal.create({
      userId: req.user.id,
      title,
      targetAmount,
      deadline: deadline || null,
    });
    res
      .status(201)
      .json({
        message: "Escape plan created. Don't let IT catch you. 🎈",
        goal,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create goal.", error: err.message });
  }
};

// @PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!goal)
      return res.status(404).json({ message: "Escape plan not found." });

    if (goal.savedAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      await goal.save();
    }

    res.json({ message: "Escape plan updated. Keep running. 🎈", goal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update goal.", error: err.message });
  }
};

// @DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal)
      return res.status(404).json({ message: "Escape plan not found." });
    res.json({ message: "Escape plan abandoned. IT wins this round." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete goal.", error: err.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
