const BudgetCategory = require("../models/budgetcategory");

// GET /api/budget
exports.getBudget = async (req, res) => {
  try {
    const categories = await BudgetCategory.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to get budget.", error: error.message });
  }
};

// POST /api/budget/categories
exports.addCategory = async (req, res) => {
  try {
    const { name, limit } = req.body;

    if (!name || !limit || Number(limit) <= 0) {
      return res.status(400).json({ message: "Category name and a valid limit are required." });
    }

    const exists = await BudgetCategory.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (exists) {
      return res.status(400).json({ message: "This category already exists." });
    }

    const category = await BudgetCategory.create({
      user: req.user._id,
      name,
      limit: Number(limit),
      spent: 0,
    });

    res.status(201).json({ message: "Category added.", category });
  } catch (error) {
    res.status(500).json({ message: "Failed to add category.", error: error.message });
  }
};

// PUT /api/budget/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await BudgetCategory.findOne({ _id: req.params.id, user: req.user._id });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (req.body.name !== undefined) category.name = req.body.name;
    if (req.body.limit !== undefined) category.limit = Number(req.body.limit);
    if (req.body.spent !== undefined) category.spent = Number(req.body.spent);

    await category.save();
    res.status(200).json({ message: "Category updated.", category });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category.", error: error.message });
  }
};

// DELETE /api/budget/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await BudgetCategory.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category.", error: error.message });
  }
};