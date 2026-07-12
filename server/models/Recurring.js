const mongoose = require("mongoose");

const recurringSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      required: true,
    },
    startDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    lastTriggered: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recurring", recurringSchema);
