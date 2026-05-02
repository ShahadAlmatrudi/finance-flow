const express = require("express");
const { getBudget, addCategory, updateCategory, deleteCategory } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getBudget);
router.post("/categories", protect, addCategory);
router.put("/categories/:id", protect, updateCategory);
router.delete("/categories/:id", protect, deleteCategory);

module.exports = router;