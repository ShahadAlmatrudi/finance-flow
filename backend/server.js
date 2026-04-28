const express = require("express");
const app = express();

// Middleware to read JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("FinanceFlow API is running");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
