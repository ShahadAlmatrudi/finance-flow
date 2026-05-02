const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String, // income or expense
      required: true,
    },
    category: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);