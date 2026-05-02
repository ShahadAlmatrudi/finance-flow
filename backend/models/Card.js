const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      default: "My Card",
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);