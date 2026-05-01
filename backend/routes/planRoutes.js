const express = require("express");
const { createPlan, getPlans, updatePlan, deletePlan } = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPlan);
router.get("/", protect, getPlans);
router.put("/:id", protect, updatePlan);
router.delete("/:id", protect, deletePlan);

module.exports = router;