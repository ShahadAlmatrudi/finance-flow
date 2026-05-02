const Plan = require("../models/Plan");

// POST /api/plans
exports.createPlan = async (req, res) => {
  try {
    const {
      goalType, goalName, targetAmount, targetDate,
      monthlySaving, savingAccount, autoTransfer, emergencyFund, categories,
    } = req.body;

    if (!goalType || !goalName || !targetAmount || !targetDate || !monthlySaving || !savingAccount) {
      return res.status(400).json({ message: "All plan fields are required." });
    }

    const plan = await Plan.create({
      user: req.user._id,
      goalType, goalName, targetAmount, targetDate,
      monthlySaving, savingAccount,
      autoTransfer: autoTransfer || false,
      emergencyFund: emergencyFund || false,
      categories: categories || [],
    });

    res.status(201).json({ message: "Plan created.", plan });
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan.", error: error.message });
  }
};

// GET /api/plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ plans });
  } catch (error) {
    res.status(500).json({ message: "Failed to get plans.", error: error.message });
  }
};

// PUT /api/plans/:id
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    const fields = [
      "goalType", "goalName", "targetAmount", "targetDate",
      "monthlySaving", "savingAccount", "autoTransfer", "emergencyFund", "categories",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        plan[field] = req.body[field];
      }
    });

    plan.markModified("categories");

    await plan.save();
    res.status(200).json({ message: "Plan updated.", plan });
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan.", error: error.message });
  }
};

// DELETE /api/plans/:id
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json({ message: "Plan deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan.", error: error.message });
  }
};