const express = require("express");
const router = express.Router();

const {
    adminLogin,
    getAllUsers,
    getAllTransactions,
    getCategories,
    createCategory,
    getReports,
    getSettings
  } = require("../controllers/adminController");
  
  router.post("/login", adminLogin);
  router.get("/users", getAllUsers);
  router.get("/transactions", getAllTransactions);
  router.get("/categories", getCategories);
  router.post("/categories", createCategory);
  router.get("/reports", getReports);
  router.get("/settings", getSettings);
  module.exports = router;