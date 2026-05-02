const express = require("express");
const router = express.Router();

const {
  importPdfTransactions,
  getTransactions,
  deleteTransaction,
} = require("../controllers/transactionController");

router.post("/import-pdf", importPdfTransactions);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);

module.exports = router;