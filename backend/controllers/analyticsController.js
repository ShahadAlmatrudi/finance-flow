const BudgetCategory = require("../models/BudgetCategory");
const Plan = require("../models/Plan");

// GET /api/analytics/summary
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const categories = await BudgetCategory.find({ user: req.user._id });
    const plans = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
    const latestPlan = plans[0] || null;

    // Total spending
    const totalSpending = categories.reduce((sum, cat) => sum + Number(cat.spent || 0), 0);

    // Top category
    const topCategory = categories.length
      ? [...categories].sort((a, b) => b.spent - a.spent)[0]
      : null;

    // Goal progress
    let goalProgress = 0;
    if (latestPlan) {
      const target = Number(latestPlan.targetAmount || 0);
      const saving = Number(latestPlan.monthlySaving || 0);
      if (target > 0 && saving > 0) {
        goalProgress = Math.min(Math.round((saving / target) * 100), 100);
      }
    }

    // Insights
    const insights = [];

    if (categories.length > 0) {
      const highest = [...categories].sort((a, b) => b.spent - a.spent)[0];
      const lowest = [...categories].sort((a, b) => a.spent - b.spent)[0];

      insights.push({ title: "Highest spending area", text: `${highest.name} is your highest spending category.` });
      insights.push({ title: "Most controlled category", text: `${lowest.name} has the lowest spending level.` });

      const nearLimit = categories.find((cat) => cat.limit > 0 && cat.spent / cat.limit >= 0.8);
      if (nearLimit) {
        insights.push({ title: "Limit warning", text: `${nearLimit.name} is close to reaching its budget limit.` });
      }
    }

    if (latestPlan?.monthlySaving) {
      insights.push({ title: "Saving commitment", text: `You are planning to save $${latestPlan.monthlySaving} every month.` });
    }

    res.status(200).json({
      totalSpending,
      topCategory: topCategory ? { name: topCategory.name, spent: topCategory.spent } : null,
      goalProgress,
      goalName: latestPlan?.goalName || "No goal set",
      monthlySaving: latestPlan?.monthlySaving || 0,
      categories,
      insights: insights.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get analytics summary.", error: error.message });
  }
};