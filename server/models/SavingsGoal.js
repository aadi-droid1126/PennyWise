const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    deadline: { type: Date, default: null },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
