const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
});

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalType: { type: String, required: true },
    goalName: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    targetDate: { type: String, required: true },
    monthlySaving: { type: Number, required: true },
    savingAccount: { type: String, required: true },
    autoTransfer: { type: Boolean, default: false },
    emergencyFund: { type: Boolean, default: false },
    categories: [categorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);