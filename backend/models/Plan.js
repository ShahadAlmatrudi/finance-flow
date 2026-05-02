const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalType: String,
    goalName: String,
    targetAmount: Number,
    targetDate: Date,
    monthlySaving: Number,
    savingAccount: String,
    autoTransfer: {
      type: Boolean,
      default: false,
    },
    emergencyFund: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        name: String,
        limit: Number,
        spent: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);