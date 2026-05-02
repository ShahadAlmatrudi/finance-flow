const express = require("express");
const router = express.Router();

const {
  getCash,
  updateCash,
} = require("../controllers/cashController");

router.get("/", getCash);
router.put("/", updateCash);

module.exports = router;