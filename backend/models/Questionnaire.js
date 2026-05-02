const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: String,
    tracking: String,
    difficulty: String,
    help: String,
    categories: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questionnaire", questionnaireSchema);