const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["expense", "income"], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true, default: "" },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", null],
      default: null,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
