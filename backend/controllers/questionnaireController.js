const Questionnaire = require("../models/questionnaire");

// POST /api/questionnaire
exports.saveQuestionnaire = async (req, res) => {
  try {
    const { goal, tracking, difficulty, help, categories } = req.body;

    if (!goal || !tracking || !difficulty || !help || !categories?.length) {
      return res.status(400).json({ message: "All questionnaire fields are required." });
    }

    const existing = await Questionnaire.findOne({ user: req.user._id });

    if (existing) {
      existing.goal = goal;
      existing.tracking = tracking;
      existing.difficulty = difficulty;
      existing.help = help;
      existing.categories = categories;
      await existing.save();
      return res.status(200).json({ message: "Questionnaire updated.", questionnaire: existing });
    }

    const questionnaire = await Questionnaire.create({
      user: req.user._id,
      goal,
      tracking,
      difficulty,
      help,
      categories,
    });

    res.status(201).json({ message: "Questionnaire saved.", questionnaire });
  } catch (error) {
    res.status(500).json({ message: "Failed to save questionnaire.", error: error.message });
  }
};

// GET /api/questionnaire
exports.getQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne({ user: req.user._id });

    if (!questionnaire) {
      return res.status(404).json({ message: "No questionnaire found." });
    }

    res.status(200).json({ questionnaire });
  } catch (error) {
    res.status(500).json({ message: "Failed to get questionnaire.", error: error.message });
  }
};