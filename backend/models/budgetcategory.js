const mongoose = require("mongoose");

const budgetCategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    limit: { type: Number, required: true },
    spent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BudgetCategory", budgetCategorySchema);