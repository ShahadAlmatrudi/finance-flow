const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await require("../models/User").find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
      const User = require("../models/User");
  
      const user = await User.findByIdAndDelete(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // GET /api/admin/transactions
exports.getAllTransactions = async (req, res) => {
    try {
      const Transaction = require("../models/transaction");
  
      const transactions = await Transaction.find();
  
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // GET /api/admin/categories
exports.getCategories = async (req, res) => {
    try {
      const Category = require("../models/BudgetCategory");
  
      const categories = await Category.find();
  
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // POST /api/admin/categories
exports.createCategory = async (req, res) => {
    try {
      const Category = require("../models/BudgetCategory");
  
      const category = await Category.create(req.body);
  
      res.status(201).json({
        message: "Category created successfully",
        category
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // GET /api/admin/reports
exports.getReports = async (req, res) => {
    try {
      const Transaction = require("../models/transaction");
  
      const totalTransactions = await Transaction.countDocuments();
  
      const totalAmount = await Transaction.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);
  
      res.json({
        totalTransactions,
        totalAmount: totalAmount[0]?.total || 0
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // GET /api/admin/settings
exports.getSettings = async (req, res) => {
    try {
      res.json({
        appName: "FinanceFlow",
        version: "1.0.0",
        status: "running"
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };