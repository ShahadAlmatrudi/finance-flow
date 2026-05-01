const BudgetCategory = require("../models/BudgetCategory");
const Plan = require("../models/Plan");

// GET /api/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const categories = await BudgetCategory.find({ user: req.user._id });
    const plans = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
    const latestPlan = plans[0] || null;

    const totalSpending = categories.reduce((sum, cat) => sum + Number(cat.spent || 0), 0);
    const totalIncome = Number(req.user.profile?.salaryRange?.split("-")[0]?.replace(/\D/g, "") || 0);

    const topCategory = categories.length
      ? [...categories].sort((a, b) => b.spent - a.spent)[0]
      : null;

    let goalProgress = 0;
    if (latestPlan) {
      const target = Number(latestPlan.targetAmount || 0);
      const saving = Number(latestPlan.monthlySaving || 0);
      if (target > 0 && saving > 0) {
        goalProgress = Math.min(Math.round((saving / target) * 100), 100);
      }
    }

    res.status(200).json({
      totalSpending,
      totalIncome,
      topCategory: topCategory ? { name: topCategory.name, spent: topCategory.spent } : null,
      goalProgress,
      goalName: latestPlan?.goalName || "No goal set",
      monthlySaving: latestPlan?.monthlySaving || 0,
      categories,
      plan: latestPlan,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get dashboard summary.", error: error.message });
  }
};