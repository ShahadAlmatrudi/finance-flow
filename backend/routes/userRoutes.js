const express = require("express");
const {
  getMe,
  updateMe,
  updateProfile,
  updateSettings,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/profile", protect, updateProfile);
router.put("/settings", protect, updateSettings);

module.exports = router;