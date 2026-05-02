const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const planRoutes = require("./routes/planRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cardRoutes = require("./routes/cardRoutes");
const cashRoutes = require("./routes/cashRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/cash", cashRoutes);
app.use("/api/transactions", transactionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.send("FinanceFlow API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});