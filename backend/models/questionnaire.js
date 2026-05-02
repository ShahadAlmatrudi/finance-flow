const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    goal: {
      type: String,
      required: true,
    },
    tracking: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    help: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questionnaire", questionnaireSchema);