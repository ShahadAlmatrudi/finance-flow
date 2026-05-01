const express = require("express");
const { saveQuestionnaire, getQuestionnaire } = require("../controllers/questionnaireController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, saveQuestionnaire);
router.get("/", protect, getQuestionnaire);

module.exports = router;